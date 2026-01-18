import React from "react";
import {AccessibilityIcon, Badge, CheckIcon, ChevronDown} from "lucide-react";


const projects = [
    {
        projektID: "06c17747f3d46ad90a8",
        status: "veröffentlicht",
        kategorie: "Natur",
        erstellungsdatum: "Mar 23, 2022, 13:00 PM",
        zuletztBearbeitetVon: "Tobias P.",
    },
    {
        projektID: "06c1774-7f3d-46ad-90a8",
        status: "hochladen",
        kategorie: "Bildung",
        erstellungsdatum: "Mar 23, 2022, 13:00 PM",
        zuletztBearbeitetVon: "Tobias P.",
    },
    {
        projektID: "06c1774-7f3d-46ad-90a8",
        status: "in bearbeitung",
        kategorie: "Bauen",
        erstellungsdatum: "Mar 23, 2022, 13:00 PM",
        zuletztBearbeitetVon: "Tobias P.",
    },
];

const statusConfig: Record<string, string> = {
    veröffentlicht: "bg-green-100 text-green-700",
    hochladen: "bg-yellow-100 text-yellow-700",
    in_bearbeitung: "bg-indigo-100 text-indigo-700",
};

export default function Page() {
    return (
        <div className="rounded-lg border bg-background">
            <table className="w-full text-sm">
                <thead className="border-b bg-muted/40">
                <tr className="text-left text-muted-foreground">
                    <th className="px-4 py-3">
                        <CheckIcon />
                    </th>
                    <th className="px-4 py-3">PROJEKT ID</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3">KATEGORIE</th>
                    <th className="px-4 py-3">ERSTELLUNGSDATUM</th>
                    <th className="px-4 py-3">ZUL. BEARBEITET VON</th>
                    <th className="px-4 py-3 text-right"></th>
                </tr>
                </thead>

                <tbody>
                {projects.map((project, index) => (
                    <tr
                        key={index}
                        className="border-b last:border-b-0 hover:bg-muted/30"
                    >
                        <td className="px-4 py-3">
                            <AccessibilityIcon />
                        </td>

                        <td className="px-4 py-3 font-mono text-sm">
                            {project.projektID.slice(0, 8)}...
                        </td>

                        <td className="px-4 py-3">
                            <Badge
                                variant="secondary"
                                className={statusConfig[project.status]}
                            >
                                {project.status}
                            </Badge>
                        </td>

                        <td className="px-4 py-3 font-medium">
                            {project.kategorie}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                            {project.erstellungsdatum}
                        </td>

                        <td className="px-4 py-3">
                            {project.zuletztBearbeitetVon}
                        </td>

                        <td className="px-4 py-3 text-right">
                            <ChevronDown className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
