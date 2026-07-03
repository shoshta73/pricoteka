import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStoresData } from "@/services/stores/useStoresData";
import { useProductsStore } from "@/stores/productsStore";

export const Route = createFileRoute("/products/create")({
  component: CreateProduct,
});

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().min(0),
  storeId: z.string(),
  officeId: z.string(),
});

function CreateProduct() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stores } = useStoresData();
  const addProduct = useProductsStore((state) => state.addProduct);
  const productExists = useProductsStore((state) => state.productExists);
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      storeId: "",
      officeId: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (productExists(value.name)) {
        toast.error(t("products.createFailureExists", { name: value.name }));
        return;
      }

      try {
        const foundIn = value.storeId && value.officeId ? [{ store_id: value.storeId, office_id: value.officeId }] : [];
        addProduct({
          name: value.name,
          description: value.description,
          price: value.price,
          found_in: foundIn,
        });
        toast.success(t("products.createSuccess", { name: value.name }));
        await navigate({ to: "/products" });
      } catch {
        toast.error(t("products.createFailure"));
      }
    },
  });

  return (
    <Card className="m-auto w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{t("products.createTitle")}</CardTitle>
        <CardDescription>{t("products.createDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-product-form"
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
                    <FieldLabel htmlFor={field.name}>{t("products.nameLabel")}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder={t("products.namePlaceholder")}
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            ></form.Field>
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t("products.descriptionLabel")}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder={t("products.descriptionPlaceholder")}
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            ></form.Field>
            <form.Field
              name="price"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t("products.priceLabel")}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="0"
                      step="0.01"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      aria-invalid={isInvalid}
                      placeholder={t("products.pricePlaceholder")}
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            ></form.Field>
            <form.Field
              name="storeId"
              children={(field) => {
                const selectedStore = stores.find((store) => store.id === field.state.value);
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{t("products.storeLabel")}</FieldLabel>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        form.setFieldValue("officeId", "");
                      }}
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">{t("products.storePlaceholder")}</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                    </select>
                    {selectedStore && selectedStore.offices.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t("products.noOfficesDescription")}</p>
                    ) : null}
                  </Field>
                );
              }}
            ></form.Field>
            <form.Field
              name="officeId"
              children={(field) => {
                const storeId = form.getFieldValue("storeId");
                const selectedStore = stores.find((store) => store.id === storeId);
                const offices = selectedStore?.offices ?? [];
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{t("products.officeLabel")}</FieldLabel>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={!selectedStore || offices.length === 0}
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">{t("products.officePlaceholder")}</option>
                      {offices.map((office) => (
                        <option key={office.id} value={office.id}>
                          {office.name}
                        </option>
                      ))}
                    </select>
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
            {t("products.resetAction")}
          </Button>
          <Button type="submit" form="create-product-form">
            {t("products.createSubmitAction")}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
