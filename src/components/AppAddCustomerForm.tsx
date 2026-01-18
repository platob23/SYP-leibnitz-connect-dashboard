import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription, FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"


export function AppAddCustomerForm() {
    return (
        <div className="w-full max-w-200">
            <form>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>Add Customer</FieldLegend>
                        <FieldDescription>This form is ...</FieldDescription>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Full name</FieldLabel>
                                <Input id="name" autoComplete="off" placeholder="Max Mustermann" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="street">Street Address</FieldLabel>
                                <Input id="street" type="text" placeholder="Musterstraße 7" />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="city">City</FieldLabel>
                                    <Input id="city" type="text" placeholder="Graz" />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
                                    <Input id="zip" type="text" placeholder="8010" />
                                </Field>
                            </div>
                        </FieldGroup>
                    </FieldSet>

                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}
