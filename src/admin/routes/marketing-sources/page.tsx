import { Button, Container, Drawer, Heading, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PhotoSolid } from "@medusajs/icons"
import { InferTypeOf } from "@medusajs/framework/types"
import { QrLink } from "../../../modules/marketing/models/qr-link"
import CreateMarketingCampaignForm from "../../components/create-campaign"

const MarketingSourcesPage = () => {
    const [open, setOpen] = useState(false)
    const [utms, setUtms] = useState<InferTypeOf<typeof QrLink>[]>([])

    const fetchSources = () => {
        fetch(`/admin/shortlink`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then(({ data }) => {
                setUtms(data)
            })
    }

    useEffect(() => {
            fetchSources()
    }, [])

    return (
        <Container className="price-tier-table">
            <div className="flex justify-between items-center mb-4">
                <Heading level="h2">
                    Tracking Tags
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
                            <Drawer.Title>Create a shortlink</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <CreateMarketingCampaignForm onSuccess={() => {
                                setOpen(false)
                                fetchSources()
                            }} />
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer>
            </div>
            {!utms && <div className="flex justify-center items-center">
                <Heading level="h3" className="text-black/50">no data to show</Heading>
            </div>}
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell className="text-center" >Campaign</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Content</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Medium</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Source</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Term</Table.HeaderCell>
                        <Table.HeaderCell className="text-center">Visits</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {utms.map((utm) => (
                        <Table.Row key={utm.id} >
                            <Table.Cell >
                                {/* <Link to={`/products/${plan.product_variant.product_id}/variants/${plan.product_variant.id}`}> */}
                                    {utm.name}
                                {/* </Link> */}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {utm.campaign_name ? utm.campaign_name : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {utm.content ? utm.content : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {utm.medium ? utm.medium : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {utm.source ? utm.source : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                {utm.term ? utm.term : "-"}
                            </Table.Cell>
                            <Table.Cell className="text-center">
                                 {utm.visits}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Shortlinks",
    icon: PhotoSolid,
})

export default MarketingSourcesPage