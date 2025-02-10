import { Button, Container, Drawer, Heading, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PhotoSolid } from "@medusajs/icons"
import CreateDeliveryPlanForm from "../../components/create-delivery-plan-form"
import { InferTypeOf } from "@medusajs/types"
import DeliveryPlan from "../../../modules/subscription/models/delivery-plan"

const DeliveryPlansPage = () => {
    const [open, setOpen] = useState(false)
    const [plans, setPlans] = useState<InferTypeOf<typeof DeliveryPlan>[]>([])

    const fetchPlans = () => {
        fetch(`/admin/delivery`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then(({ data }) => {
                setPlans(data)
                console.log(data)
            })
    }

    useEffect(() => {
            fetchPlans()
    }, [])

    return (
        <Container className="price-tier-table">
            <div className="flex justify-between items-center mb-4">
                <Heading level="h2">
                    Delivery Plans
                </Heading>
                <Drawer open={open} onOpenChange={(openChanged) => setOpen(openChanged)}>
                    <Drawer.Trigger
                        onClick={() => {
                            setOpen(true)
                        }}
                        asChild
                    >
                        <Button>Create</Button>
                    </Drawer.Trigger>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Create a New delivery schedule</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <CreateDeliveryPlanForm onSuccess={() => {
                                setOpen(false)
                                fetchPlans()
                            }} />
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer>
            </div>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Plan Title</Table.HeaderCell>
                        <Table.HeaderCell
                            className="text-center"
                            colSpan={7}
                        >
                            Schedule</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell className="text-center" >Day 1</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Day 2</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Day 3</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Day 4</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Day 5</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">day 6</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Day 7</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {plans.map((plan) => (
                        <Table.Row key={plan.id} >
                            <Table.Cell >
                                    {plan.title}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.day1 ? plan.day1 : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.day2 ? plan.day2 : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.day3 ? plan.day3 : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.day4 ? plan.day4 : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.day5 ? plan.day5 : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.day6 ? plan.day6 : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.day7 ? plan.day7 : "-"}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Delivery Plans",
    icon: PhotoSolid,
})

export default DeliveryPlansPage