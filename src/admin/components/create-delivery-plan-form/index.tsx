import { useState } from "react"
import { Input, Button, toast, CurrencyInput, Label } from "@medusajs/ui"
import { z } from "zod"
import { CreateDeliveryPlanSchema } from "../../validation-schemas"

type Props = {
  onSuccess?: () => void
}

type InputFieldsTypes = z.infer<typeof CreateDeliveryPlanSchema>

type ValidationErrors = {
  [field: string]: string[];
};

const CreateDeliveryPlanForm = ({
  onSuccess,
}: Props) => {
  const [plan, setPlan] = useState({
    name: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
    price: "",
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState(false)

  const updatePlan = (field: keyof InputFieldsTypes, value: string | number) => {
    setPlan((prev) => {
      const newPlan = { ...prev, [field]: value };

      // Validate individual field
      try {
        const fieldSchema = CreateDeliveryPlanSchema.shape[field];
        fieldSchema.parse(value);
        // Clear field error if validation passes
        const newErrors = { ...errors };
        if (newErrors) {
          delete newErrors[field];
        }
        setErrors(newErrors);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setErrors(prev => ({
            ...prev,
            [field]: err.errors.map(e => e.message)
          }));
        }
      }
      return newPlan;
    }
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
    const result = CreateDeliveryPlanSchema.safeParse(plan)

    if (!result.success) {
      const formattedErrors: ValidationErrors = {}
      result.error.errors.forEach((error) => {
        const path = error.path;
        if (path.length >= 2) {
          const [index, field] = path;
          formattedErrors[index] = {
            ...formattedErrors[index],
            [field as string]: [error.message]
          };

        }
      })
      setErrors(formattedErrors)
      setLoading(false)
      toast.error(result.error.errors.map(e => e.message).join(", "))
      return
    }

    // Clear errors if validation passes
    setErrors({});
    const data = result.data

    fetch("/admin/delivery", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(({ message }) => {
        if (message) {
          toast.success(message)
        }
        onSuccess?.()
      })
    // console.log(data)
    // toast.success("Successfully validated price tier package")
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit}>
      <Input
        name="title"
        placeholder="Title"
        type="text"
        value={plan?.name}
        onChange={(e) => updatePlan("name", e.target.value)}
      />
      <fieldset className="my-4 space-y-2">
        <legend className="">Schedule</legend>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2 grid-rows-7 justify-items-start">
          <Label htmlFor="monday">Monday :</Label>
          <Input
            id="monday"
            name="monday"
            type="text"
            value={plan?.monday}
            onChange={(e) => updatePlan("monday", e.target.value)}
          />
          <Label htmlFor="tuesday">Tuesday :</Label>
          <Input
            id="tuesday"
            name="tuesday"
            type="text"
            value={plan?.tuesday}
            onChange={(e) => updatePlan("tuesday", e.target.value)}
          />
          <Label htmlFor="wednesday">Wednesday :</Label>
          <Input
            id="wednesday"
            name="wednesday"
            type="text"
            value={plan?.wednesday}
            onChange={(e) => updatePlan("wednesday", e.target.value)}
          />
          <Label htmlFor="thursday">Thursday :</Label>
          <Input
            id="thursday"
            name="thursday"
            type="text"
            value={plan?.thursday}
            onChange={(e) => updatePlan("thursday",e.target.value)}
          />
          <Label htmlFor="friday">Friday :</Label>
          <Input
            id="friday"
            name="friday"
            type="text"
            value={plan?.friday}
            onChange={(e) => updatePlan("friday", e.target.value)}
          />
          <Label htmlFor="saturday">Saturday :</Label>
          <Input
            id="saturday"
            name="saturday"
            type="text"
            value={plan?.saturday}
            onChange={(e) => updatePlan("saturday",e.target.value)}
          />
          <Label htmlFor="sunday">Sunday :</Label>
          <Input
            id="sunday"
            name="sunday"
            type="text"
            value={plan?.sunday}
            onChange={(e) => updatePlan("sunday", e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="my-4 space-y-2">
        <legend className="">Price</legend>
        <CurrencyInput
          symbol="$"
          code="cad"
          name="price_per_meal"
          placeholder="Price / meal"
          allowDecimals={true}
          allowNegativeValue={false}
          decimalScale={2}
          type="text"
          className="max-w-48"
          value={plan.price}
          onChange={(e) => updatePlan("price", e.target.value)}
          required
        />
      </fieldset>



      <Button
        type="submit"
        isLoading={loading}
      >
        Create
      </Button>
    </form>
  )
}

export default CreateDeliveryPlanForm