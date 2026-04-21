const items = [
    {
        label: "Home",
        text: "Startseite des Dashboards.",
    },
    {
        label: "Analysen",
        text: "Zeigt ein Balkendiagramm mit der Anzahl der erstellten Projekte pro Monat.",
    },
    {
        label: "Projekte",
        text: "Übersicht aller Projekte in einer Tabelle. Die Liste kann nach Status, Kategorie und Bearbeitungsdatum gefiltert werden. Ein Klick auf eine Zeile öffnet das Bearbeitungsformular. Projekte können per Checkbox ausgewählt und gelöscht werden.",
    },
    {
        label: "Neues Projekt",
        text: "Formular zum Erstellen eines neuen Projekts. Pflichtfelder sind Titel und Kategorie. Optional können Kurzbeschreibung, Beschreibung, Status und ein Bild angegeben werden.",
    },
    {
        label: "Dokumentation",
        text: "Diese Seite – Erklärung aller Menüpunkte.",
    },
]

export default function Page() {
    return (
        <div className="rounded-lg border bg-background">
            <div className="p-4 border-b">
                <h1 className="text-lg font-semibold">Dokumentation</h1>
                <p className="text-sm text-muted-foreground mt-1">Erklärung der Menüpunkte</p>
            </div>

            <div className="p-4">
                {items.map(item => (
                    <div key={item.label} className="grid grid-cols-[160px_1fr] gap-3 text-sm py-3 border-b last:border-b-0">
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span className="text-muted-foreground">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
