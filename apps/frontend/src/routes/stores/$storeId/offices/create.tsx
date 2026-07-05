import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@pricoteka/ui-core/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@pricoteka/ui-core/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@pricoteka/ui-core/field";
import { Input } from "@pricoteka/ui-core/input";
import { useCreateOfficeAction } from "@/services/stores/useCreateOfficeAction";
import { useStoresStore } from "@/stores/storesStore";

export const Route = createFileRoute("/stores/$storeId/offices/create")({
  component: CreateStoreOffice,
});

const formSchema = z.object({
  name: z.string(),
});

function CreateStoreOffice() {
  const { t } = useTranslation();
  const { storeId } = Route.useParams();
  const navigate = useNavigate();
  const officeExists = useStoresStore((state) => state.officeExists);
  const { createOffice, isPending } = useCreateOfficeAction();

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (officeExists(storeId, value.name)) {
        toast.error(t("stores.createOfficeFailureExists", { name: value.name }));
        return;
      }
      await createOffice(storeId, value.name);
      toast.success(t("stores.createOfficeSuccess", { name: value.name }));
      await navigate({ to: "/stores/$storeId", params: { storeId } });
    },
  });

  return (
    <Card className="m-auto w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{t("stores.createOfficeTitle")}</CardTitle>
        <CardDescription>{t("stores.createOfficeDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-store-office-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t("stores.officeNameLabel")}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder={t("stores.officeNamePlaceholder")}
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            ></form.Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {t("stores.resetAction")}
          </Button>
          <Button type="submit" form="create-store-office-form" disabled={isPending}>
            {t("stores.createSubmitAction")}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
