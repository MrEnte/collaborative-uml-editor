from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType

from task_management.models import Group, Task, Diagram

group_names = [
    "Group Green",
    "Group Blue",
    "Group Red",
]
amount_of_users_per_group = 3

task_description = """
Die AGSR möchte im Zuge der Einführung eines neuen Abo-Angebots für Fahrgäste eine Software einsetzen, die Unterstützung nicht nur für die Abo-Verwaltung, sondern auch für die allgemeine Kostenplanung bietet.

Herr Preuß brachte zum Ausdruck, dass durch eine präzisere Planung der Kosten die Servicequalität gesteigert werden soll, die wesentlich durch sichere und pünktliche Transporte sowie durch saubere Fahrzeuge bestimmt wird.

„Bei der Kostenplanung werden geschätzte und tatsächliche Einnahmen sowie geplante und bereits getätigte Ausgaben berücksichtigt. Zum Beispiel werden jährliche Ausgaben für die Instandhaltung des Fuhrparks und für die Beschaffung neuer Fahrzeuge geplant. Einnahmen, z.B. aus Verkäufen am Fahrscheinautomaten und am Schalter, werden stets im Voraus für das Folgejahr geschätzt“ so Preuss.

Für Abonnements müssen der Name, die Adresse und eine Bankverbindung von Fahrgästen erfasst werden. Eltern können Fahrkarten für ihre Kinder abonnieren. Es können Abos sowohl für Jahres- und Monatsfahrkarten als auch für bestimmte Tarifzonen abgeschlossen werden. Eine Mindestlaufzeit für Abonnements ist aktuell nicht vorgesehen. Entstandene Kosten werden automatisch von den hinterlegten Bankkonten abgebucht. „Ein Vorteil für unsere Kunden ist, dass ihnen die Fahrkarten zugesandt werden“, betonte Preuss im Interview. Gleichzeitig soll das Abo-Angebot auch die Planung der Einnahmen erleichtern.

Herr Preuß wies auf eine Fahrgast-Befragung hin, die zur Einführung des neuen Abo-Angebotes von der AGSR durchgeführt wurde. Dabei wurde festgestellt, dass manche Fahrgäste in gewissen Tarifzonen nur zu bestimmten Jahreszeiten unterwegs sind. Zum Beispiel antwortete ein Befragter: „Ich jobbe da im Sommer und fahre nur deswegen dorthin“. Es stellte sich jedoch auch heraus, dass solche Fahrgäste in den Tarifzonen auch zu anderen Jahreszeiten unterwegs sind, dafür aber kein Abo abschließen würden.
"""


def creation():
    User = get_user_model()

    admin = User.objects.create_superuser(
        username="admin",
        password="DasIstKeinSicheresPasswort1234!",
    )

    for group_name in group_names:
        group = Group.objects.create(
            name=group_name,
            created_by=admin,
        )

        for i in range(amount_of_users_per_group):
            User.objects.create_user(
                username=f"{group_name} User {i + 1}", password="Test1234!"
            )

        task = Task.objects.create(
            group=group,
            description=task_description,
            created_by=admin,
        )

        task_content_type = ContentType.objects.get_for_model(Task)
        Diagram.objects.create(
            content_type=task_content_type,
            object_id=task.id,
        )

        print(f"Group {group_name} created")
