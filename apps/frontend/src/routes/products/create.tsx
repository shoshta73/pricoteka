import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateProductAction } from "@/services/products/useCreateProductAction";
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
  const productExists = useProductsStore((state) => state.productExists);
  const { createProduct, isPending } = useCreateProductAction();
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
        await createProduct({
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
                    <FieldLabel>{t("products.storeLabel")}</FieldLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button type="button" variant="outline" className="w-full justify-start font-normal" />}
                        aria-label={t("products.storeLabel")}
                        onBlur={field.handleBlur}
                      >
                        {selectedStore?.name ?? t("products.storePlaceholder")}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            field.handleChange("");
                            form.setFieldValue("officeId", "");
                          }}
                        >
                          {t("products.storePlaceholder")}
                        </DropdownMenuItem>
                        {stores.map((store) => (
                          <DropdownMenuItem
                            key={store.id}
                            onClick={() => {
                              field.handleChange(store.id);
                              form.setFieldValue("officeId", "");
                            }}
                          >
                            {store.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                    <FieldLabel>{t("products.officeLabel")}</FieldLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start font-normal"
                            disabled={!selectedStore || offices.length === 0}
                          />
                        }
                        aria-label={t("products.officeLabel")}
                        onBlur={field.handleBlur}
                      >
                        {offices.find((office) => office.id === field.state.value)?.name ??
                          t("products.officePlaceholder")}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => field.handleChange("")}>
                          {t("products.officePlaceholder")}
                        </DropdownMenuItem>
                        {offices.map((office) => (
                          <DropdownMenuItem key={office.id} onClick={() => field.handleChange(office.id)}>
                            {office.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
          <Button type="submit" form="create-product-form" disabled={isPending}>
            {t("products.createSubmitAction")}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
