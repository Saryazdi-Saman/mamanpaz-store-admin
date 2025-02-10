import { useEffect, useState } from "react"
import { Input, Button, toast, CurrencyInput, FocusModal, Label, Select, Table } from "@medusajs/ui"
import { Loader, Minus, Plus } from "@medusajs/icons"
import { PriceTiersArraySchema, PriceTierSchema } from "../../validation-schemas"
import { z } from "zod"
import { InferTypeOf } from "@medusajs/types"
import DeliveryPlan from "../../../modules/subscription/models/delivery-plan"

type Props = {
  onSuccess?: () => void
}

type PriceTierInputType = z.infer<typeof PriceTierSchema>

type PriceTierValidationErrors = {
  [key: string]: {
    [field: string]: string[];
  };
};

const CreatPriceTierPackage = ({
  onSuccess,
}: Props) => {


  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [tiers, setTiers] = useState([{
    name: "",
    slug: "",
    delivery_schedule_id: "",
    meals_per_day: "",
    price_per_meal: "",
  }])
  const [deliveryPlans, setDeliveryPlans] = useState<InferTypeOf<typeof DeliveryPlan>[]>([])
  const [errors, setErrors] = useState<PriceTierValidationErrors>({})

  const addTier = () => {
    setTiers([...tiers, {
      name: "",
      slug: "",
      delivery_schedule_id: "",
      meals_per_day: "",
      price_per_meal: "",
    }]);
  };

  const removeTier = (index: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== index));
    // Clear errors for removed tier
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const updateTier = (index: number, field: keyof PriceTierInputType, value: string) => {
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
    setLoading(true)
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
      setLoading(false)
      toast.error(result.error.errors.map(e => e.message).join(", "))
      return
    }

    // Clear errors if validation passes
    setErrors({});

    const data = result.data
    const response = await fetch("/admin/plans", {
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
    if (!response.ok) {
      toast.error("Failed to create price tier package")
      setLoading(false)
      return
    }

    const { message } = await response.json()
    if (message) {
      toast.error(message)
      setLoading(false)
      return
    }
    onSuccess?.()
    toast.success("Successfully created plans")
    setLoading(false)
  }

  useEffect(() => {
    fetch("/admin/delivery", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ data }) => {
        setDeliveryPlans(data)
      })
  }, [])

  return (

    <FocusModal.Content>
      <form onSubmit={handleSubmit}>
        <FocusModal.Header>
          <Button
            disabled={loading}
          >{
              loading ? <Loader className="animate-spin" /> : "Save"}</Button>
        </FocusModal.Header>
        <FocusModal.Body className="px-10 py-6">
          <div className="pl-5 pb-6">
            <Label htmlFor="category_name">Plan Category Name: </Label>
            <Input
              id="category_name"
              name="category_name"
              placeholder="Title"
              type="text"
              className="max-w-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Delivery Schedule</Table.HeaderCell>
                <Table.HeaderCell>Plan Title</Table.HeaderCell>
                <Table.HeaderCell>Slug</Table.HeaderCell>
                <Table.HeaderCell>Meals per day</Table.HeaderCell>
                <Table.HeaderCell>Price per meal</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tiers.map((tier, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Select
                      onValueChange={(value) => {
                        const selectedPlan = deliveryPlans.find(deliveryPlan => deliveryPlan.id === value)
                        updateTier(index, "delivery_schedule_id", value)
                        updateTier(index, "delivery_schedule_title", selectedPlan?.title || "")
                      }}>
                      <Select.Trigger className="w-48">
                        <Select.Value placeholder="Select" />
                      </Select.Trigger>
                      <Select.Content>
                        {deliveryPlans.map((item) => (
                          <Select.Item key={item.id} value={item.id}>
                            {item.title}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      name="title"
                      placeholder="Name"
                      type="text"
                      value={tier.name}
                      onChange={(e) => updateTier(index, "name", e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      name="slug"
                      placeholder="slug"
                      type="text"
                      value={tier.slug}
                      onChange={(e) => updateTier(index, "slug", e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      name="meals_per_day"
                      placeholder="# Meals / day"
                      type="text"
                      value={tier.meals_per_day}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          updateTier(index, "meals_per_day", value)
                        }
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell>
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
                    />
                  </Table.Cell>
                  <Table.Cell>

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
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div className="pl-6 pt-4">
          <Button type="button" onClick={addTier}><Plus />Add Rows</Button>
          </div>

        </FocusModal.Body>
      </form>
    </FocusModal.Content>
  )
}

export default CreatPriceTierPackage