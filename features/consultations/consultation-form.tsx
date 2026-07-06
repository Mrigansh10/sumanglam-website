"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/lib/analytics";
import {
  consultationSchema,
  contactMethodLabels,
  contactMethodValues,
  projectTypeLabels,
  projectTypeValues,
} from "@/lib/validation/consultation";

type FieldErrors = Partial<Record<string, string>>;

/**
 * Consultation form. Validates with the same zod schema on client and server,
 * captures source context (page, type, referrer), and shows a calm success
 * state. No account required.
 */
export function ConsultationForm() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startedTracked = useRef(false);

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Source context: ?source=/products/some-product (set by CTA links) or referrer.
  const sourcePage = searchParams.get("source") ?? pathname;
  const sourceType = searchParams.get("sourceType") ?? "consultation_form";

  useEffect(() => {
    if (!startedTracked.current) {
      startedTracked.current = true;
      trackEvent("consultation_started", { sourceType, sourceId: sourcePage });
    }
  }, [sourceType, sourcePage]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const raw = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      requirements: String(formData.get("requirements") ?? ""),
      preferredContactMethod:
        String(formData.get("preferredContactMethod") ?? "") || undefined,
      sourcePage,
      sourceType,
      referringUrl: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    };

    const parsed = consultationSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/v1/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        setStatus("idle");
        setFormError(
          result?.error?.message ??
            "We couldn't submit your request right now. Please try again, or reach us on WhatsApp.",
        );
        return;
      }
      trackEvent("consultation_submitted", { sourceType, sourceId: sourcePage });
      setStatus("success");
    } catch {
      setStatus("idle");
      setFormError(
        "We couldn't submit your request right now. Please try again, or reach us on WhatsApp.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line bg-surface p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden />
        <h2 className="mt-4 font-display text-2xl text-ink">
          Thank you - we&apos;ve received your request
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          A Sumanglam designer will reach out within one working day to set up
          your consultation. If it&apos;s urgent, call us or visit the showroom -
          walk-ins are always welcome.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/contact" variant="outline">
            Plan a Showroom Visit
          </Button>
          <Button href="/inspiration" variant="ghost">
            Keep Exploring Inspirations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {formError ? (
        <p role="alert" className="border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
          {formError}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name ? (
            <p id="name-error" className="text-xs text-error">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone ? (
            <p id="phone-error" className="text-xs text-error">
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <p id="email-error" className="text-xs text-error">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectType">Project Type *</Label>
          <Select
            id="projectType"
            name="projectType"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? "projectType-error" : undefined}
          >
            <option value="" disabled>
              Choose your project
            </option>
            {projectTypeValues.map((value) => (
              <option key={value} value={value}>
                {projectTypeLabels[value]}
              </option>
            ))}
          </Select>
          {errors.projectType ? (
            <p id="projectType-error" className="text-xs text-error">
              {errors.projectType}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Tell us about your project *</Label>
        <Textarea
          id="requirements"
          name="requirements"
          required
          placeholder="The space, the timeline, what you're imagining — anything that helps us prepare."
          aria-invalid={Boolean(errors.requirements)}
          aria-describedby={errors.requirements ? "requirements-error" : undefined}
        />
        {errors.requirements ? (
          <p id="requirements-error" className="text-xs text-error">
            {errors.requirements}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredContactMethod">How should we reach you?</Label>
        <Select id="preferredContactMethod" name="preferredContactMethod" defaultValue="">
          <option value="">No preference</option>
          {contactMethodValues.map((value) => (
            <option key={value} value={value}>
              {contactMethodLabels[value]}
            </option>
          ))}
        </Select>
      </div>

      <div className="pt-2">
        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? "Sending…" : "Request Consultation"}
        </Button>
        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          We use these details only to arrange your consultation. No spam, no
          mailing lists.
        </p>
      </div>
    </form>
  );
}
