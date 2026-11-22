"use client";

import { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  Field,
  Input,
  Select,
  Textarea,
  Toast,
  getFieldDescribedBy,
} from "@/components/ui";
import { content } from "@/lib/content";

export function StyleguideInteractive() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [sampleChecked, setSampleChecked] = useState(true);

  return (
    <div className="space-y-14">
      {/* Inputs in all states */}
      <div className="space-y-6">
        <h3 className="font-display-expanded text-h3">Inputs &amp; form controls</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field
            id="sg-input-default"
            label="Default input"
            helperText="Helper text sits directly below the field."
          >
            <Input
              id="sg-input-default"
              placeholder="name@example.com"
              aria-describedby={getFieldDescribedBy("sg-input-default", { hasHelper: true })}
            />
          </Field>

          <Field
            id="sg-input-filled"
            label="Filled input"
            optionalText="Optional"
          >
            <Input id="sg-input-filled" defaultValue="+91 98765 43210" />
          </Field>

          <Field
            id="sg-input-error"
            label="Error state"
            error={content.validation.emailInvalid}
          >
            <Input
              id="sg-input-error"
              defaultValue="not-an-email"
              hasError
              aria-describedby={getFieldDescribedBy("sg-input-error", { hasError: true })}
            />
          </Field>

          <Field id="sg-input-disabled" label="Disabled input">
            <Input id="sg-input-disabled" value="Locked value" disabled />
          </Field>

          <Field id="sg-select" label="Select control">
            <Select
              id="sg-select"
              defaultValue="film"
              options={content.contact.enquiryTypes}
            />
          </Field>

          <Field id="sg-select-error" label="Select error" error={content.validation.typeRequired}>
            <Select
              id="sg-select-error"
              defaultValue=""
              placeholder={content.contact.fields.type.placeholder}
              options={content.contact.enquiryTypes}
              hasError
              aria-describedby={getFieldDescribedBy("sg-select-error", { hasError: true })}
            />
          </Field>

          <Field
            id="sg-textarea"
            label="Textarea"
            counter="42 / 1000"
            className="md:col-span-2"
          >
            <Textarea
              id="sg-textarea"
              defaultValue="Tell us about your film, campaign or live event."
            />
          </Field>

          <Checkbox
            id="sg-checkbox-ok"
            label={content.notify.consentLabel}
            checked={sampleChecked}
            onChange={(event) => setSampleChecked(event.target.checked)}
          />

          <Checkbox
            id="sg-checkbox-error"
            label={content.notify.consentLabel}
            error={content.validation.consentRequired}
          />
        </div>
      </div>

      {/* Dialog & Toast triggers */}
      <div className="space-y-6">
        <h3 className="font-display-expanded text-h3">Dialog &amp; Toast</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title={content.notify.dialogTitle}
            description={content.notify.dialogDescription("[Event Name]")}
            closeLabel={content.notify.closeLabel}
            trigger={
              <Button variant="ink" withArrow>
                Open dialog
              </Button>
            }
          >
            <div className="space-y-4">
              <p className="text-[0.9375rem] text-muted">
                Dialog renders centered on desktop (max-width 480px) and as a full-width bottom
                sheet on mobile. ESC and backdrop click close it and return focus to the trigger.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="yellow"
                  onClick={() => {
                    setDialogOpen(false);
                    setToastOpen(true);
                  }}
                >
                  Confirm &amp; show toast
                </Button>
              </div>
            </div>
          </Dialog>

          <Button variant="yellow" onClick={() => setToastOpen(true)}>
            Trigger toast (4s)
          </Button>
        </div>

        <Toast
          open={toastOpen}
          message={content.notify.successMessage}
          onClose={() => setToastOpen(false)}
        />
      </div>
    </div>
  );
}

