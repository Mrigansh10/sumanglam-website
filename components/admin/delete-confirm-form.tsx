"use client";

import { useEffect, useRef, useState } from "react";

interface HiddenField {
  name: string;
  value: string;
}

interface DeleteConfirmFormProps {
  /** The server action to run on confirm. */
  action: (formData: FormData) => void | Promise<void>;
  /** Hidden inputs submitted with the form (e.g. the record id). */
  fields: HiddenField[];
  /** Text of the trigger button. */
  label?: string;
  /** Heading shown in the confirmation dialog. */
  title: string;
  /** Body copy explaining the consequence of deleting. */
  description: string;
  /** Text of the confirm button inside the dialog. */
  confirmLabel?: string;
}

// A delete button that opens an in-page confirmation dialog before submitting
// its server action. Avoids the native window.confirm(), which cannot be styled
// and blocks the event loop.
export function DeleteConfirmForm({
  action,
  fields,
  label = "Delete",
  title,
  description,
  confirmLabel = "Delete",
}: DeleteConfirmFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Run the server action to completion, THEN close the dialog. Closing first
  // would unmount the form and cancel the in-flight submission.
  async function handleAction(formData: FormData) {
    setPending(true);
    try {
      await action(formData);
    } finally {
      setPending(false);
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-line px-3 py-1.5 text-xs text-ink-soft transition hover:border-red-300 hover:text-red-600"
      >
        {label}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-line bg-background p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="font-display text-lg">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-md border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:border-ink disabled:opacity-50"
              >
                Cancel
              </button>
              <form action={handleAction}>
                {fields.map((field) => (
                  <input
                    key={field.name}
                    type="hidden"
                    name={field.name}
                    value={field.value}
                  />
                ))}
                <button
                  ref={confirmRef}
                  type="submit"
                  disabled={pending}
                  className="rounded-md bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {pending ? "Deleting…" : confirmLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
