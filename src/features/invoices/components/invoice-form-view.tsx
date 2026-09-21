"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Loader2 } from "lucide-react"

import { Card } from "@/components/ui/card"
import { FormTextarea } from "@/components/forms"
import { useInvoice, useCreateInvoice, useUpdateInvoice } from "../api/invoice.queries"
import {
  createInvoiceSchema,
  type CreateInvoiceFormValues,
} from "../validations/invoice.schema"
import type { InvoiceItem } from "../@types/invoice"
import { InvoiceFormHeader } from "./invoice-form-header"
import { InvoiceFormClientFields } from "./invoice-form-client-fields"
import { InvoiceFormItemsTable } from "./invoice-form-items-table"
import { InvoiceFormSummary } from "./invoice-form-summary"

interface InvoiceFormViewProps {
  invoiceId?: string
}

export function InvoiceFormView({ invoiceId }: InvoiceFormViewProps): React.JSX.Element {
  const router = useRouter()
  const isEdit = Boolean(invoiceId)

  // Fetch invoice if editing
  const { data: existingInvoice, isLoading: isFetchingInvoice } = useInvoice(
    invoiceId || "",
    isEdit
  )

  const createMutation = useCreateInvoice()
  const updateMutation = useUpdateInvoice()

  // Default due date: today + 14 days
  const defaultDueDate = React.useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split("T")[0]
  }, [])

  // React Hook Form instance with Zod Resolver
  const methods = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      client_id: "",
      license_id: "",
      status: "unpaid",
      due_date: defaultDueDate,
      payment_method: "",
      notes: "",
      items: [
        {
          description: "Langganan Lisensi Bulanan POS",
          quantity: 1,
          unit_price: 150000,
          amount: 150000,
        },
      ],
      total_amount: 150000,
    },
  })

  const { setValue, reset, control } = methods

  const rawItems = useWatch({ control, name: "items" })
  const watchedDueDate = useWatch({ control, name: "due_date" }) || ""
  const watchedStatus = useWatch({ control, name: "status" }) || "unpaid"
  const watchedClientId = useWatch({ control, name: "client_id" }) || ""

  const watchedItems = React.useMemo(() => rawItems || [], [rawItems])

  // Populate form when existing invoice is loaded
  React.useEffect(() => {
    if (isEdit && existingInvoice) {
      reset({
        client_id: existingInvoice.client_id,
        license_id: existingInvoice.license_id || "",
        status: existingInvoice.status,
        due_date: existingInvoice.due_date
          ? existingInvoice.due_date.split("T")[0]
          : "",
        payment_method: existingInvoice.payment_method || "",
        notes: existingInvoice.notes || "",
        items:
          existingInvoice.items && existingInvoice.items.length > 0
            ? existingInvoice.items
            : [],
        total_amount: existingInvoice.total_amount || 0,
      })
    }
  }, [isEdit, existingInvoice, reset])

  // Calculate totals directly from items
  const itemsTotal = React.useMemo(() => {
    return watchedItems.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0
    )
  }, [watchedItems])

  const totalQuantity = React.useMemo(() => {
    return watchedItems.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0),
      0
    )
  }, [watchedItems])

  // Sync total_amount in form values
  React.useEffect(() => {
    setValue("total_amount", itemsTotal, { shouldValidate: true })
  }, [itemsTotal, setValue])

  // Line item actions
  const handleAddItem = (preset?: { description: string; price: number }) => {
    const current = watchedItems || []
    setValue(
      "items",
      [
        ...current,
        {
          description: preset ? preset.description : "",
          quantity: 1,
          unit_price: preset ? preset.price : 0,
          amount: preset ? preset.price : 0,
        },
      ],
      { shouldValidate: true }
    )
  }

  const handleRemoveItem = (index: number) => {
    const current = watchedItems || []
    setValue(
      "items",
      current.filter((_, idx) => idx !== index),
      { shouldValidate: true }
    )
  }

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    val: string | number
  ) => {
    const current = [...(watchedItems || [])]
    const item = { ...current[index] }

    if (field === "description") {
      item.description = String(val)
    } else if (field === "quantity") {
      item.quantity = Math.max(1, Number(val) || 1)
      item.amount = item.quantity * item.unit_price
    } else if (field === "unit_price") {
      item.unit_price = Math.max(0, Number(val) || 0)
      item.amount = item.quantity * item.unit_price
    }

    current[index] = item
    setValue("items", current, { shouldValidate: true })
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const canSubmit = isEdit ? true : Boolean(watchedClientId.trim())

  const onSubmit = async (data: CreateInvoiceFormValues) => {
    const finalItems = data.items && data.items.length > 0 ? data.items : null

    if (isEdit && invoiceId) {
      await updateMutation.mutateAsync({
        id: invoiceId,
        payload: {
          status: data.status,
          due_date: data.due_date,
          payment_method: data.payment_method || null,
          notes: data.notes || null,
          items: finalItems,
        },
      })
      router.push("/invoices")
    } else {
      await createMutation.mutateAsync({
        client_id: data.client_id.trim(),
        license_id: data.license_id?.trim() || null,
        total_amount: itemsTotal,
        status: data.status,
        due_date: data.due_date,
        payment_method: data.payment_method?.trim() || null,
        notes: data.notes?.trim() || null,
        items: finalItems,
      })
      router.push("/invoices")
    }
  }

  if (isEdit && isFetchingInvoice) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Memuat data invoice...</p>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 pb-12">
        {/* Top Bar Navigation & Actions */}
        <InvoiceFormHeader
          isEdit={isEdit}
          invoiceNumber={existingInvoice?.invoice_number}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          onCancel={() => router.push("/invoices")}
        />

        {/* Main Form Layout (8 cols left, 4 cols right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Columns (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Customer & Relation Fields */}
            <InvoiceFormClientFields
              isEdit={isEdit}
              clientRelation={existingInvoice?.client}
            />

            {/* Line Items Table */}
            <InvoiceFormItemsTable
              items={watchedItems}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onItemChange={handleItemChange}
            />

            {/* Notes & Instructions with FormTextarea */}
            <Card className="rounded-2xl border-border bg-card p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border pb-3">
                <FileText className="size-4 text-primary" />
                <span>Catatan Faktur & Petunjuk Pembayaran</span>
              </div>
              <FormTextarea
                name="notes"
                placeholder="Contoh: Silakan transfer ke rekening BCA 12345678 a.n. PT Mitrasova Solusi Digital. Konfirmasi ke WhatsApp CS jika sudah membayar."
              />
            </Card>
          </div>

          {/* Right Sticky Column (4 cols) */}
          <div className="lg:col-span-4">
            <InvoiceFormSummary
              itemCount={watchedItems.length}
              totalQuantity={totalQuantity}
              dueDate={watchedDueDate}
              status={watchedStatus}
              totalAmount={itemsTotal}
              isSubmitting={isSubmitting}
              canSubmit={canSubmit}
              isEdit={isEdit}
              onCancel={() => router.push("/invoices")}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
