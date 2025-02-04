import { useEffect, useState } from "react"
import { Input, Button, toast, Label, Select } from "@medusajs/ui"
import { z } from "zod"
import { CreateCampaignSchema } from "../../validation-schemas"
import { UTM_Content, UTM_Medium, UTM_Source } from "../../types"
import { CampaignDTO, PromotionDTO } from "@medusajs/types"
import { createUtmSource, getCampaigns } from "../../lib"

type Props = {
  onSuccess?: () => void
}

type InputFieldsTypes = z.infer<typeof CreateCampaignSchema>

type ValidationErrors = {
  [field: string]: string[];
};

const CreateMarketingCampaignForm = ({
  onSuccess,
}: Props) => {
  const [plan, setPlan] = useState({
    name: "",
    campaign: "",
    campaign_id: "",
    promotion: "",
    medium: "",
    source: "",
    content: "",
    term: "",
    short_path: "",
    destination_url: "",
  })

  const [campaigns, setCampaigns] = useState<CampaignDTO[]>([])
  const [promotions, setPromotions] = useState<PromotionDTO[] | undefined>([])

  const utmSources = Object.values(UTM_Source).map((value) => ({
    value,
    label: value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) // Format label nicely
  }));

  const utmMediums = Object.values(UTM_Medium).map((value) => ({
    value,
    label: value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }));
  const utmContent = Object.values(UTM_Content).map((value) => ({
    value,
    label: value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }));

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState(false)

  const updatePlan = (field: keyof InputFieldsTypes, value: string) => {
    setPlan((prev) => {
      const newPlan = { ...prev, [field]: value };

      // Validate individual field
      try {
        const fieldSchema = CreateCampaignSchema.shape[field];
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
    const result = CreateCampaignSchema.safeParse(plan)

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
    const message = await createUtmSource(data)
    if (message) {
      toast.success(message)
      onSuccess?.()
    }
    if (!message) {
      toast.error("Failed to create campaign")
    }
    setLoading(false)
  }

  useEffect(() => {
    getCampaigns().then((campaigns) => {
      if (!campaigns) {
        return
      }
      setCampaigns(campaigns)
    })
  }, [])

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <Input
          name="name "
          placeholder="Title"
          type="text"
          value={plan?.name}
          onChange={(e) => updatePlan("name", e.target.value)}
        />
      </div>
      <div>
        <Label>Campaign:</Label>
        <Select onValueChange={(value) => {
          const selectedCampaign = campaigns.find(campaign => campaign.campaign_identifier === value)
          if (selectedCampaign) {
            updatePlan("campaign_id", selectedCampaign.id)
            setPromotions(selectedCampaign.promotions)
          } else {
            updatePlan("campaign_id", "")
            updatePlan("promotion", "")
          }
          updatePlan("campaign", value)
        }}>
          <Select.Trigger>
            <Select.Value placeholder="Select" />
          </Select.Trigger>
          <Select.Content>
            {campaigns.map((item) => (
              <Select.Item key={item.campaign_identifier!} value={item.campaign_identifier!}>
                {item.name!}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
      <div>
        <Label>Promotions:</Label>
        <Select
          disabled={!promotions || promotions.length === 0}
          onValueChange={(value) => {
            updatePlan("promotion", value)
          }}
        >
          <Select.Trigger>
            <Select.Value
              placeholder={
                promotions && promotions.length > 0 ? "Select" : "No promotions available"
              }
            />
          </Select.Trigger>
          <Select.Content>
            {promotions && promotions.map((item) => (
              <Select.Item key={item.id} value={item.id}>
                {item.code}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
      <fieldset className="my-4">
        <legend className="">UTM Tags</legend>
        <div className="space-y-2">
          <div>
            <Label>Source:</Label>
            <Select onValueChange={(value) => updatePlan("source", value)}>
              <Select.Trigger>
                <Select.Value placeholder="Select" />
              </Select.Trigger>
              <Select.Content>
                {utmSources.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div>
            <Label>Medium:</Label>
            <Select onValueChange={(value) => updatePlan("medium", value)}>
              <Select.Trigger>
                <Select.Value placeholder="Select" />
              </Select.Trigger>
              <Select.Content>
                {utmMediums.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div>
            <Label>Content:</Label>
            <Select onValueChange={(value) => updatePlan("content", value)}>
              <Select.Trigger>
                <Select.Value placeholder="Select" />
              </Select.Trigger>
              <Select.Content>
                {utmContent.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2 grid-rows-7 justify-items-start py-2">
          <Label htmlFor="term">term :</Label>
          <Input
            id="term"
            name="term"
            type="text"
            value={plan?.term}
            onChange={(e) => updatePlan("term", e.target.value)}
          />
          <Label htmlFor="short_path">short_path :</Label>
          <Input
            id="short_path"
            name="short_path"
            type="text"
            value={plan?.short_path}
            onChange={(e) => updatePlan("short_path", e.target.value)}
          />
          <Label htmlFor="destination_url">destination_url :</Label>
          <Input
            id="destination_url"
            name="destination_url"
            type="text"
            value={plan?.destination_url}
            onChange={(e) => updatePlan("destination_url", e.target.value)}
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

export default CreateMarketingCampaignForm