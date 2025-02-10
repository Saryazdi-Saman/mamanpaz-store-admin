import { useState } from "react"
import { Input, Button, toast, Label } from "@medusajs/ui"
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
    day_one: "",
    day_two: "",
    day_three: "",
    day_four: "",
    day_five: "",
    day_six: "",
    day_seven: "",
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
          <Label htmlFor="day_one">Day 1:</Label>
          <Input
            id="day_one"
            name="day_one"
            type="text"
            value={plan?.day_one}
            onChange={(e) => updatePlan("day_one", e.target.value)}
          />
          <Label htmlFor="day_two">Day 2:</Label>
          <Input
            id="day_two"
            name="day_two"
            type="text"
            value={plan?.day_two}
            onChange={(e) => updatePlan("day_two", e.target.value)}
          />
          <Label htmlFor="day_three">Day 3:</Label>
          <Input
            id="day_three"
            name="day_three"
            type="text"
            value={plan?.day_three}
            onChange={(e) => updatePlan("day_three", e.target.value)}
          />
          <Label htmlFor="day_four">Day 4:</Label>
          <Input
            id="day_four"
            name="day_four"
            type="text"
            value={plan?.day_four}
            onChange={(e) => updatePlan("day_four", e.target.value)}
          />
          <Label htmlFor="day_five">Day 5:</Label>
          <Input
            id="day_five"
            name="day_five"
            type="text"
            value={plan?.day_five}
            onChange={(e) => updatePlan("day_five", e.target.value)}
          />
          <Label htmlFor="day_six">Day 6:</Label>
          <Input
            id="day_six"
            name="day_six"
            type="text"
            value={plan?.day_six}
            onChange={(e) => updatePlan("day_six", e.target.value)}
          />
          <Label htmlFor="day_seven">Day 7:</Label>
          <Input
            id="day_seven"
            name="day_seven"
            type="text"
            value={plan?.day_seven}
            onChange={(e) => updatePlan("day_seven", e.target.value)}
          />
        </div>
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