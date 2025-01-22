import { Button, Container, Drawer, Heading, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { DeliveryPlan } from "../../types"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PhotoSolid } from "@medusajs/icons"
import CreateDeliveryPlanForm from "../../components/create-delivery-plan-form"

const DeliveryPlansPage = () => {
    const [open, setOpen] = useState(false)
    const [plans, setPlans] = useState<DeliveryPlan[]>([])

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
                            <Drawer.Title>Create Price Tier</Drawer.Title>
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
            {!plans && <div className="flex justify-center items-center">
                <Heading level="h3" className="text-black/50">no data to show</Heading>
            </div>}
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell
                            className="text-center"
                            colSpan={7}
                        >
                            Schedule</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Price</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell className="text-center" >Monday</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Tuesday</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Wednesday</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Thursday</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Friday</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Saturday</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Sunday</Table.HeaderCell>
                        <Table.HeaderCell className="text-center"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {plans.map((plan) => (
                        <Table.Row key={plan.id} >
                            <Table.Cell >
                                <Link to={`/products/${plan.product_variant.product_id}/variants/${plan.product_variant.id}`}>
                                    {plan.name}
                                </Link>
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.monday ? plan.monday : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.tuesday ? plan.tuesday : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.wednesday ? plan.wednesday : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.thursday ? plan.thursday : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.friday ? plan.friday : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.saturday ? plan.saturday : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {plan.sunday ? plan.sunday : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {`$ ${plan.price}`}
                            </Table.Cell>
                            {/* <Table.Cell className="text-center">
                                <Link to={`/products/`}>
                                    View Product
                                </Link>
                            </Table.Cell> */}
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