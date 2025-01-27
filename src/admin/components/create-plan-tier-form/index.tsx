import { useEffect, useState } from "react"
import { Input, Button, Select, toast, CurrencyInput } from "@medusajs/ui"
import { Minus, Plus } from "@medusajs/icons"
import { PackageTitleSchema, PriceTierInputFieldsSchema, PriceTiersArraySchema, PriceTierSchema } from "../../validation-schemas"
import { z } from "zod"

type Props = {
  onSuccess?: () => void
}

type PriceTierInputType = z.infer<typeof PriceTierSchema>

type InputFieldsTypes = z.infer<typeof PriceTierInputFieldsSchema>

type PackageTitleInput = z.infer<typeof PackageTitleSchema>

type PriceTierValidationErrors = {
  [key: string]: {
    [field: string]: string[];
  };
};

type PackageTitleValidationError = {
  error: string;
}

const CreatPriceTierPackage = ({
  onSuccess,
}: Props) => {

  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [tiers, setTiers] = useState<InputFieldsTypes[]>([{}])
  const [errors, setErrors] = useState<PriceTierValidationErrors>({})

  const addTier = () => {
    setTiers([...tiers, {}]);
  };

  const removeTier = (index: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== index));
    // Clear errors for removed tier
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const updateTier = (index: number, field: keyof PriceTierInputType, value: string | number) => {
    setTiers((prev) => prev.map((tier, i) => {
      if (i === index) {
        const newTier = { ...tier, [field]: value };

        // Validate individual field
        try {
          const fieldSchema = PriceTierSchema.shape[field];
          fieldSchema.parse(value);
          // Clear field error if validation passes
          const newErrors = { ...errors };
          if (newErrors[index]) {
            delete newErrors[index][field];
            if (Object.keys(newErrors[index]).length === 0) {
              delete newErrors[index];
            }
          }
          setErrors(newErrors);
        } catch (err) {
          if (err instanceof z.ZodError) {
            setErrors(prev => ({
              ...prev,
              [index]: {
                ...prev[index],
                [field]: err.errors.map(e => e.message)
              }
            }));
          }
        }
        return newTier;
      }
      return tier;
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // TODO handle submit
    e.preventDefault()
    const result = PriceTiersArraySchema.safeParse(tiers)

    if (!result.success) {
      const formattedErrors: PriceTierValidationErrors = {}
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
      toast.error(result.error.errors.map(e => e.message).join(", "))
      return
    }

    // Clear errors if validation passes
    setErrors({});
    const data = result.data

    fetch("/admin/price-tiers", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        price_tiers: data,
      }),
    })
      .then((res) => res.json())
      .then(({ message }) => {
        if (message) {
          toast.error(message)
        }
        onSuccess?.()
      })
    toast.success("Successfully validated price tier package")
    setLoading(false)
  }

  return (
    <div className="h-full max-h-[46rem] overflow-y-scroll relative px-4 py-2">

      <form onSubmit={handleSubmit}>
        <Input
          name="category_name"
          placeholder="Category Title"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <fieldset className="my-4 space-y-4">
          <legend className="">Tiers</legend>
          {tiers.map((tier, index) => (
            <div key={index} className="flex gap-2 items-center justify-between">
              <div className="input-fields flex flex-col gap-2 items-start">
                <div className="flex gap-2">

                  <Input
                    name="title"
                    placeholder="Title"
                    type="text"
                    value={tier.name}
                    onChange={(e) => updateTier(index, "name", e.target.value)}
                    required
                  />
                  <Input
                    name="slug"
                    placeholder="slug"
                    type="text"
                    value={tier.slug}
                    onChange={(e) => updateTier(index, "slug", e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    name="meals_per_day"
                    placeholder="# Meals / day"
                    type="text"
                    className="text-right"
                    value={tier.meals_per_day}
                    onChange={(e) => updateTier(index, "meals_per_day", Number(e.target.value))}
                    required
                  />
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
                    value={tier.price_per_meal}
                    onChange={(e) => updateTier(index, "price_per_meal", e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="button"
                size="small"
                onClick={() => removeTier(index)}
                className=""
                disabled={tiers.length === 1}
              >
                <Minus />
                <span className="">Remove</span>
              </Button>
            </div>
          ))}
        </fieldset>
        <div className="flex justify-between">
          <Button
            type="submit"
            isLoading={loading}
          >
            Create
          </Button>
          <Button type="button" onClick={addTier}><Plus />Add Tier</Button>
        </div>
      </form>
    </div>
  )
}

export default CreatPriceTierPackage