import { useEffect, useState } from "react"
import { PlanCategory, PriceTier } from "../../types"
import { Button, Container, Drawer, Heading, Table } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PhotoSolid } from "@medusajs/icons"
import CreatPriceTierPackage from "../../components/create-plan-tier-form"
import { Link } from "react-router-dom"

type TSelectedCategory = {
    id: string
    product_id: string
}

const PriceTiersPage = () => {
    const [open, setOpen] = useState(false)
    const [priceTiers, setPriceTiers] = useState<PriceTier[]>([])
    const [planCategories, setPlanCategories] = useState<PlanCategory[]>([])
    const [selectedCategory, setCategory] = useState<TSelectedCategory | undefined>(undefined)

    const fetchCategories = () => {
        fetch(`/admin/plan-categories`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then(({
                plan_categories: data,
            }) => {
                setPlanCategories(data)
            })
    }

    const fetchPriceTiers = () => {
        fetch(`/admin/plan-categories`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: selectedCategory?.id,
            }),
        })
            .then((res) => res.json())
            .then(({
                price_tiers: data,
            }) => {
                setPriceTiers(data)
            })
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            fetchPriceTiers()
        }
    }, [selectedCategory])


    return (
        <>
            <Container className="category-selector">
                <div className="flex justify-between items-center mb-4">
                    <Heading level="h2">Packages</Heading>
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
                                <CreatPriceTierPackage onSuccess={() => {
                                    setOpen(false)
                                    // if (currentPage === 0) {
                                    //     fetchProducts()
                                    // } else {
                                    //     setCurrentPage(0)
                                    // }
                                }} />
                            </Drawer.Body>
                        </Drawer.Content>
                    </Drawer>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-2">
                    {planCategories.map((category) => (
                        <Button
                            key={category.id}
                            variant={category.id === selectedCategory?.id ? "primary" : "secondary"}
                            disabled={category.id === selectedCategory?.id}
                            onClick={() => setCategory({
                                id: category.id,
                                product_id: category.product.id
                            })}
                            className="border-black border"
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </Container>
            <Container className="price-tier-table">
                <div className="flex justify-between items-center mb-4">
                    <Heading level="h2">
                        {selectedCategory ? `${planCategories.find((category) => category.id === selectedCategory?.id)?.name}` : "Select a category to see plans"}
                    </Heading>
                    {selectedCategory && <Link to={`/products/${selectedCategory?.product_id}`}>
                        View Product
                    </Link>}
                </div>
                {!selectedCategory && <div className="flex justify-center items-center">
                    <Heading level="h3" className="text-black/50">no data to show</Heading>
                </div>}
                {selectedCategory && <>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Title</Table.HeaderCell>
                                <Table.HeaderCell className="text-center">Meals Per Day</Table.HeaderCell>
                                <Table.HeaderCell className="text-center">Meals Per Week</Table.HeaderCell>
                                <Table.HeaderCell className="text-center">Price Per Meal</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {priceTiers.map((priceTier) => (
                                <Table.Row key={priceTier.id}>
                                    <Table.Cell>
                                        {priceTier.name}
                                    </Table.Cell>
                                    <Table.Cell className="text-center">
                                        {priceTier.meals_per_day}
                                    </Table.Cell>
                                    <Table.Cell className="text-center">
                                        {priceTier.meals_per_week}
                                    </Table.Cell>
                                    <Table.Cell className="text-center">
                                        {`$ ${priceTier.price_per_meal}`}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </>}

            </Container>
        </>
    )
}

export const config = defineRouteConfig({
    label: "Price Tiers",
    icon: PhotoSolid,
})

export default PriceTiersPage