import json
from textual.app import App, ComposeResult
from textual.containers import Horizontal, Vertical, ScrollableContainer
from textual.widgets import Header, Footer, ListView, ListItem, Label, RadioSet, RadioButton, TextArea
from textual.reactive import reactive

DEPARTMENTS = [
    "WEB_DEVELOPMENT",
    "BLOCK_CHAIN",
    "REVERSE_ENGINEERING",
    "MACHINE_LEARNING",
    "DESIGN"
]

QUESTIONS = {
    "WEB_DEVELOPMENT": [
        {
            "id": 1,
            "type": "mcq",
            "text": "What does CORS stand for?",
            "options": [
                "Cross-Origin Resource Sharing", 
                "Cross-Origin Resource Security", 
                "Control-Origin Resource Sharing", 
                "Central-Origin Resource Sharing"
            ]
        },
        {
            "id": 2,
            "type": "subjective",
            "text": "Explain the difference between SSR and CSR in Next.js. Provide an example of when to use each."
        }
    ],
    "BLOCK_CHAIN": [
        {
            "id": 1,
            "type": "subjective",
            "text": "Explain the Byzantine Generals Problem and how it relates to consensus."
        }
    ],
    "REVERSE_ENGINEERING": [
        {
            "id": 1,
            "type": "mcq",
            "text": "Which of the following is an open-source reverse engineering tool maintained by the NSA?",
            "options": ["IDA Pro", "Ghidra", "Radare2", "Binary Ninja"]
        }
    ],
    "MACHINE_LEARNING": [
        {
            "id": 1,
            "type": "subjective",
            "text": "Describe the architecture of a Transformer model and its key advantages over LSTMs."
        }
    ],
    "DESIGN": [
        {
            "id": 1,
            "type": "subjective",
            "text": "Provide a link to your Figma portfolio highlighting your most recent UI/UX case study."
        }
    ]
}

class DepartmentItem(ListItem):
    def __init__(self, name: str) -> None:
        super().__init__()
        self.dept_name = name
    
    def compose(self) -> ComposeResult:
        yield Label(f"[ {self.dept_name} ]", classes="dept-label")

class QuestionWidget(Vertical):
    def __init__(self, q: dict) -> None:
        super().__init__()
        self.q = q
    
    def compose(self) -> ComposeResult:
        yield Label(f"$ assessment --question {self.q['id']:02d}", classes="question-prompt")
        yield Label(self.q['text'], classes="question-text")
        
        if self.q["type"] == "mcq":
            with RadioSet():
                for opt in self.q["options"]:
                    yield RadioButton(opt)
        else:
            yield TextArea(placeholder="> Enter response here...")
            yield Label("> Note: If this question requires a file, paste a public link.", classes="helper-text")

class AssessmentView(ScrollableContainer):
    department = reactive("")

    def watch_department(self, old_dept: str, new_dept: str) -> None:
        if not new_dept:
            return
        # Remove existing questions
        self.query(QuestionWidget).remove()
        
        # Load new questions
        questions = QUESTIONS.get(new_dept, [])
        if not questions:
            self.mount(Label("> No questions available for this department yet.", classes="empty-state"))
        else:
            for q in questions:
                self.mount(QuestionWidget(q))

class CyscomCLI(App):
    CSS_PATH = "app.tcss"
    BINDINGS = [
        ("ctrl+c", "quit", "Quit"),
        ("tab", "focus_next", "Next Field"),
        ("shift+tab", "focus_previous", "Prev Field"),
    ]

    def compose(self) -> ComposeResult:
        yield Header(show_clock=True)
        with Horizontal(id="main-layout"):
            with Vertical(id="sidebar"):
                yield Label("/departments/", id="sidebar-title")
                yield ListView(*[DepartmentItem(d) for d in DEPARTMENTS], id="dept-list")
            yield AssessmentView(id="assessment-view")
        yield Footer()

    def on_mount(self) -> None:
        self.title = "> CYSCOM ASSESSMENT TERMINAL"
        # Set initial department
        list_view = self.query_one(ListView)
        if list_view.children:
            # Set focus to list view initially so j/k works out of the box
            list_view.focus()
            self.query_one(AssessmentView).department = DEPARTMENTS[0]
            self.title = f"> CYSCOM ASSESSMENT TERMINAL - {DEPARTMENTS[0]}"

    def on_list_view_selected(self, event: ListView.Selected) -> None:
        item = event.item
        if isinstance(item, DepartmentItem):
            self.query_one(AssessmentView).department = item.dept_name
            self.title = f"> CYSCOM ASSESSMENT TERMINAL - {item.dept_name}"

    def on_list_view_highlighted(self, event: ListView.Highlighted) -> None:
        # Update view immediately on highlight (up/down) without needing to press Enter
        item = event.item
        if isinstance(item, DepartmentItem):
            self.query_one(AssessmentView).department = item.dept_name
            self.title = f"> CYSCOM ASSESSMENT TERMINAL - {item.dept_name}"

if __name__ == "__main__":
    app = CyscomCLI()
    app.run()
