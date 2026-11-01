import json
import os
import sys

sys.path.insert(0, r"c:\Projects\apps\BBLearningApp\scripts")
from importlib.machinery import SourceFileLoader

ext = SourceFileLoader("extract_curriculum", r"c:\Projects\apps\BBLearningApp\scripts\extract-curriculum.py").load_module()
subjects = ext.subjects
units = ext.units
excel_weeks = ext.excel_weeks

badges = [
    {
        "id": "badge-mult-master",
        "title": "Multiplication Master",
        "description": "Achieved Mastery (81+ SmartScore) in Bluebonnet Grade 3 Multiplication & Division skills!",
        "icon": "Trophy",
        "category": "math",
        "xpReward": 150,
        "coinReward": 50,
        "criteriaText": "Reach SmartScore 81+ on any Multiplication or Division skill in Module 1 or Module 3"
    },
    {
        "id": "badge-reading-champ",
        "title": "Reading Champion",
        "description": "Mastered Reading Comprehension & Story Analysis in Bluebonnet Reading Language Arts!",
        "icon": "BookOpenCheck",
        "category": "reading",
        "xpReward": 150,
        "coinReward": 50,
        "criteriaText": "Reach SmartScore 81+ on any Reading Language Arts skill"
    },
    {
        "id": "badge-streak-5",
        "title": "5-Day Streak",
        "description": "Practiced for 5 consecutive days on Bluebonnet Quest!",
        "icon": "Flame",
        "category": "streak",
        "xpReward": 200,
        "coinReward": 75,
        "criteriaText": "Maintain a 5-day learning streak"
    },
    {
        "id": "badge-vocab-hero",
        "title": "Vocabulary Hero",
        "description": "Mastered Bluebonnet Core Vocabulary, Context Clues, and Morphology!",
        "icon": "Award",
        "category": "reading",
        "xpReward": 120,
        "coinReward": 40,
        "criteriaText": "Answer 10 Vocabulary & Morphology questions accurately"
    },
    {
        "id": "badge-fraction-expert",
        "title": "Fraction Expert",
        "description": "Mastered Module 5 Fractions as Numbers on the Number Line!",
        "icon": "PieChart",
        "category": "math",
        "xpReward": 175,
        "coinReward": 60,
        "criteriaText": "Reach SmartScore 81+ on Module 5 Fractions skills"
    },
    {
        "id": "badge-phonics-detective",
        "title": "Phonics & Syllable Detective",
        "description": "Mastered Multisyllabic Decoding, Digraphs, Vowel Teams, and Suffix Rules!",
        "icon": "Sparkles",
        "category": "foundational",
        "xpReward": 140,
        "coinReward": 45,
        "criteriaText": "Reach SmartScore 81+ on any Foundational Skills lesson"
    },
    {
        "id": "badge-place-value-pioneer",
        "title": "Place Value & Measurement Pioneer",
        "description": "Mastered Numbers to 100,000, Time Intervals, and Liquid Volume in Module 2!",
        "icon": "Compass",
        "category": "math",
        "xpReward": 150,
        "coinReward": 50,
        "criteriaText": "Reach SmartScore 81+ on Module 2 Place Value & Measurement skills"
    },
    {
        "id": "badge-geometry-explorer",
        "title": "Area & Perimeter Architect",
        "description": "Mastered Area Models (Module 4) and Polygons & Perimeter (Module 7)!",
        "icon": "Shapes",
        "category": "math",
        "xpReward": 160,
        "coinReward": 55,
        "criteriaText": "Reach SmartScore 81+ on Module 4 or Module 7 Geometry skills"
    }
]

lessons = []
skills = []
questions = []

# Helper to add a complete lesson + skills + questions
def add_bundle(lesson_obj, skills_list):
    lessons.append(lesson_obj)
    for sk, q_list in skills_list:
        sk["questionIds"] = [q["id"] for q in q_list]
        skills.append(sk)
        questions.extend(q_list)

# ==============================================================================
# DOMAIN 1: MATHEMATICS LESSONS, SKILLS & QUESTIONS (Modules 1 to 7)
# ==============================================================================
math_lesson_blueprints = [
    # MODULE 1
    {
        "unitId": "unit-math-m1",
        "lessonNumber": 1,
        "topicCode": "Topic A",
        "title": "Lesson 1: Equal Groups and Array Models as Multiplication",
        "teks": ["3.4D", "3.4E", "3.5B"],
        "objective": "Understand equal groups of objects as multiplication and relate repeated addition to rectangular arrays.",
        "sourcePdf": "BLMATH-G3-M1-Learn-ENG.pdf (pp. 3–16)",
        "intro": "In Bluebonnet Module 1 Topic A, we discover that when objects are arranged in equal groups or rows in an array, we can use multiplication instead of long repeated addition sentences to find the total quickly!",
        "workedExample": {
            "id": "we-m1-l1",
            "title": "Read–Draw–Write: Equal Groups to Multiplication",
            "problem": "Caroline, Brian, and Marta share a box of chocolates. They each get 4 chocolates. How many chocolates are there in all?",
            "steps": [
                "Step 1 (Read): There are 3 friends (groups), and each friend gets 4 chocolates (size of each group).",
                "Step 2 (Draw): Draw 3 circles (groups) with 4 dots in each, or a rectangular array with 3 rows of 4.",
                "Step 3 (Write Repeated Addition): 4 + 4 + 4 = 12.",
                "Step 4 (Write Multiplication Equation): 3 groups of four = 3 × 4 = 12 chocolates."
            ],
            "solution": "3 × 4 = 12 chocolates in all.",
            "visualModelType": "array",
            "visualData": {"rows": 3, "cols": 4, "itemLabel": "chocolate"}
        },
        "skills": [
            {
                "id": "skill-math-m1-1",
                "code": "M1.A.1",
                "title": "Relate Equal Groups and Repeated Addition to Multiplication",
                "teks": "3.4E",
                "difficulty": 1,
                "nextSkillId": "skill-math-m1-2",
                "questions": [
                    {
                        "id": "q-m1-1-1",
                        "type": "multiple_choice",
                        "difficulty": 1,
                        "teks": "3.4E",
                        "prompt": "Look at the repeated addition equation from Module 1 Lesson 1: 3 + 3 + 3 + 3 + 3 = 15. Which multiplication statement represents 5 groups of three?",
                        "options": ["5 × 3 = 15", "3 × 3 = 9", "5 + 3 = 8", "15 × 3 = 45"],
                        "correctAnswer": "5 × 3 = 15",
                        "hint": "Count how many 3s are being added together. That is the number of groups!",
                        "workedExplanation": "There are 5 equal groups of 3: 3 + 3 + 3 + 3 + 3 = 15, which is written as 5 × 3 = 15."
                    },
                    {
                        "id": "q-m1-1-2",
                        "type": "fill_blank",
                        "difficulty": 1,
                        "teks": "3.4D",
                        "prompt": "A picture shows 4 groups of 2 slices of watermelon: 2 + 2 + 2 + 2 = 8. Complete the multiplication equation: 4 × ___ = 8",
                        "correctAnswer": "2",
                        "acceptableAnswers": ["2", "two"],
                        "hint": "How many slices of watermelon are in each of the 4 groups?",
                        "workedExplanation": "4 groups of 2 slices equals 8 slices total, so 4 × 2 = 8."
                    },
                    {
                        "id": "q-m1-1-3",
                        "type": "matching",
                        "difficulty": 2,
                        "teks": "3.4E",
                        "prompt": "Match each equal-groups description from Bluebonnet Module 1 Problem Set 1 to its matching multiplication expression.",
                        "matchingPairs": [
                            {"left": "3 groups of 5", "right": "3 × 5 = 15"},
                            {"left": "4 groups of 6", "right": "4 × 6 = 24"},
                            {"left": "6 groups of 4", "right": "6 × 4 = 24"},
                            {"left": "2 groups of 10", "right": "2 × 10 = 20"}
                        ],
                        "correctAnswer": "3 groups of 5:3 × 5 = 15|4 groups of 6:4 × 6 = 24|6 groups of 4:6 × 4 = 24|2 groups of 10:2 × 10 = 20",
                        "hint": "The first factor tells the number of groups, and the second factor tells the size of each group.",
                        "workedExplanation": "3 groups of 5 is 3 × 5 = 15; 4 groups of 6 is 4 × 6 = 24; 6 groups of 4 is 6 × 4 = 24; 2 groups of 10 is 2 × 10 = 20."
                    },
                    {
                        "id": "q-m1-1-4",
                        "type": "drag_drop",
                        "difficulty": 2,
                        "teks": "3.4D",
                        "prompt": "Sort each expression into the correct product bucket: Equals 12 or Equals 20.",
                        "dragDropCategories": ["Equals 12", "Equals 20"],
                        "dragDropItems": [
                            {"id": "dd-1", "label": "3 rows of 4", "category": "Equals 12"},
                            {"id": "dd-2", "label": "4 groups of 5", "category": "Equals 20"},
                            {"id": "dd-3", "label": "6 + 6", "category": "Equals 12"},
                            {"id": "dd-4", "label": "2 × 10", "category": "Equals 20"}
                        ],
                        "correctAnswer": "Equals 12:3 rows of 4,6 + 6|Equals 20:4 groups of 5,2 × 10",
                        "hint": "Multiply or skip-count each expression to find whether its total is 12 or 20.",
                        "workedExplanation": "3 rows of 4 = 12 and 6 + 6 = 12. 4 groups of 5 = 20 and 2 × 10 = 20.",
                        "isMiniAssessment": True
                    }
                ]
            },
            {
                "id": "skill-math-m1-2",
                "code": "M1.C.2",
                "title": "Commutative & Distributive Properties with Arrays and Division Unknowns",
                "teks": "3.4K",
                "difficulty": 2,
                "easierSkillId": "skill-math-m1-1",
                "questions": [
                    {
                        "id": "q-m1-2-1",
                        "type": "multiple_choice",
                        "difficulty": 2,
                        "teks": "3.4E",
                        "prompt": "Using the break apart and distribute strategy from Module 1 Topic C, how can you decompose 7 × 4 into two easier facts using 5s and 2s?",
                        "options": [
                            "(5 × 4) + (2 × 4) = 20 + 8 = 28",
                            "(5 × 4) × (2 × 4) = 160",
                            "(7 × 2) + (7 × 1) = 21",
                            "(5 + 4) + (2 + 4) = 15"
                        ],
                        "correctAnswer": "(5 × 4) + (2 × 4) = 20 + 8 = 28",
                        "hint": "Break 7 fours into 5 fours plus 2 fours!",
                        "workedExplanation": "7 rows of 4 can be broken into 5 rows of 4 (20) plus 2 rows of 4 (8). 20 + 8 = 28."
                    },
                    {
                        "id": "q-m1-2-2",
                        "type": "fill_blank",
                        "difficulty": 2,
                        "teks": "3.5D",
                        "prompt": "Find the unknown factor in this division problem from Topic B: 24 ÷ 4 = ___ (Think: 4 × ___ = 24)",
                        "correctAnswer": "6",
                        "acceptableAnswers": ["6", "six"],
                        "hint": "Skip-count by 4s until you reach 24: 4, 8, 12, 16, 20, 24.",
                        "workedExplanation": "Since 4 × 6 = 24, the quotient of 24 ÷ 4 is 6."
                    },
                    {
                        "id": "q-m1-2-3",
                        "type": "sequencing",
                        "difficulty": 2,
                        "teks": "3.4K",
                        "prompt": "Order the steps of the Bluebonnet Read–Draw–Write (RDW) process from first to last.",
                        "sequenceItems": [
                            "Read the problem carefully to identify what is known and unknown.",
                            "Draw and label a model such as an array, number bond, or strip diagram.",
                            "Write a number sentence (equation) to solve the problem.",
                            "Write a word sentence (statement) that answers the question."
                        ],
                        "correctAnswer": "Read the problem carefully to identify what is known and unknown.|Draw and label a model such as an array, number bond, or strip diagram.|Write a number sentence (equation) to solve the problem.|Write a word sentence (statement) that answers the question.",
                        "hint": "Remember what the letters R - D - W stand for!",
                        "workedExplanation": "The RDW process always follows: 1. Read, 2. Draw and label, 3. Write an equation, 4. Write a word statement.",
                        "isMiniAssessment": True
                    }
                ]
            }
        ]
    },
    # MODULE 2
    {
        "unitId": "unit-math-m2",
        "lessonNumber": 1,
        "topicCode": "Topics A–D",
        "title": "Lesson 1: Time Intervals, Liquid Volume, and Place Value to 100,000",
        "teks": ["3.2A", "3.2B", "3.2D", "3.4B", "3.7C", "3.7E"],
        "objective": "Solve elapsed time and liquid volume problems, represent numbers to 100,000 in expanded notation, compare numbers, and round on a vertical number line.",
        "sourcePdf": "BLMATH-G3-M2-Learn-ENG.pdf",
        "intro": "In Module 2, we measure time intervals on number lines, measure weight (oz, lb) and liquid volume (mL, L), and extend our place value chart all the way to the hundred thousands place!",
        "workedExample": {
            "id": "we-m2-l1",
            "title": "Expanded Notation & Vertical Number Line Rounding",
            "problem": "Write 46,382 in expanded notation, then round 382 to the nearest hundred.",
            "steps": [
                "Step 1 (Place Value Chart): 4 ten thousands, 6 thousands, 3 hundreds, 8 tens, 2 ones.",
                "Step 2 (Expanded Notation): (4 × 10,000) + (6 × 1,000) + (3 × 100) + (8 × 10) + (2 × 1).",
                "Step 3 (Vertical Number Line for 382): Bottom endpoint is 300, top endpoint is 400, halfway midpoint is 350.",
                "Step 4 (Round): Since 382 is above the halfway mark 350, 382 rounds to 400."
            ],
            "solution": "(4 × 10,000) + (6 × 1,000) + (3 × 100) + (8 × 10) + (2 × 1); 382 ≈ 400.",
            "visualModelType": "place_value",
            "visualData": {"tenThousands": 4, "thousands": 6, "hundreds": 3, "tens": 8, "ones": 2}
        },
        "skills": [
            {
                "id": "skill-math-m2-1",
                "code": "M2.C.1",
                "title": "Place Value, Expanded Notation, and Comparing Numbers to 100,000",
                "teks": "3.2A",
                "difficulty": 1,
                "nextSkillId": "skill-math-m2-2",
                "questions": [
                    {
                        "id": "q-m2-1-1",
                        "type": "multiple_choice",
                        "difficulty": 1,
                        "teks": "3.2A",
                        "prompt": "Which expression shows the number 54,709 written in expanded notation?",
                        "options": [
                            "(5 × 10,000) + (4 × 1,000) + (7 × 100) + (9 × 1)",
                            "(5 × 1,000) + (4 × 100) + (7 × 10) + (9 × 1)",
                            "(50 × 10,000) + (4 × 1,000) + (7 × 10)",
                            "5 + 4 + 7 + 0 + 9"
                        ],
                        "correctAnswer": "(5 × 10,000) + (4 × 1,000) + (7 × 100) + (9 × 1)",
                        "hint": "Look at the place value of each non-zero digit: 5 is in the ten thousands place, 4 in the thousands, 7 in the hundreds, and 9 in the ones.",
                        "workedExplanation": "54,709 has 5 ten thousands (5 × 10,000), 4 thousands (4 × 1,000), 7 hundreds (7 × 100), 0 tens, and 9 ones (9 × 1)."
                    },
                    {
                        "id": "q-m2-1-2",
                        "type": "fill_blank",
                        "difficulty": 2,
                        "teks": "3.7C",
                        "prompt": "Patrick starts soccer practice at 4:15 p.m. and finishes 40 minutes later. What time does practice end? (Write in format like 4:55)",
                        "correctAnswer": "4:55",
                        "acceptableAnswers": ["4:55", "4:55 p.m.", "4:55 pm"],
                        "hint": "Count forward 40 minutes from 15 minutes past 4: 15 + 40 = 55.",
                        "workedExplanation": "Starting at 4:15 p.m. and adding a 40-minute interval on the number line reaches 4:55 p.m."
                    },
                    {
                        "id": "q-m2-1-3",
                        "type": "sequencing",
                        "difficulty": 2,
                        "teks": "3.2D",
                        "prompt": "Order these whole numbers from LEAST (top) to GREATEST (bottom) using place value.",
                        "sequenceItems": [
                            "9,850",
                            "34,120",
                            "34,890",
                            "82,005"
                        ],
                        "correctAnswer": "9,850|34,120|34,890|82,005",
                        "hint": "First compare the ten thousands place (9,850 has 0 ten thousands!), then compare the hundreds place for 34,120 and 34,890.",
                        "workedExplanation": "9,850 < 34,120 < 34,890 < 82,005.",
                        "isMiniAssessment": True
                    }
                ]
            },
            {
                "id": "skill-math-m2-2",
                "code": "M2.E.2",
                "title": "Rounding & Three-Digit Addition/Subtraction with the Standard Algorithm",
                "teks": "3.4A",
                "difficulty": 2,
                "easierSkillId": "skill-math-m2-1",
                "questions": [
                    {
                        "id": "q-m2-2-1",
                        "type": "multiple_choice",
                        "difficulty": 2,
                        "teks": "3.4A",
                        "prompt": "Solve using the standard algorithm from Module 2 Topic F: A big container holds 403 liters of water. 185 liters are poured out. How many liters of water remain?",
                        "options": ["218 liters", "222 liters", "382 liters", "588 liters"],
                        "correctAnswer": "218 liters",
                        "hint": "Decompose 4 hundreds into 3 hundreds, 9 tens, and 13 ones to subtract 403 - 185.",
                        "workedExplanation": "403 - 185: Regroup 400 as 3 hundreds, 9 tens, 13 ones. 13 - 5 = 8 ones, 9 - 8 = 1 ten, 3 - 1 = 2 hundreds = 218 liters."
                    },
                    {
                        "id": "q-m2-2-2",
                        "type": "matching",
                        "difficulty": 2,
                        "teks": "3.7D",
                        "prompt": "Match each measurement scenario to the most appropriate unit from Module 2 Topic B.",
                        "matchingPairs": [
                            {"left": "Liquid volume of a small medicine spoon", "right": "Milliliters (mL)"},
                            {"left": "Liquid volume of a large kitchen pitcher", "right": "Liters (L)"},
                            {"left": "Weight of a single strawberry", "right": "Ounces (oz)"},
                            {"left": "Weight of a third-grade student's backpack", "right": "Pounds (lb)"}
                        ],
                        "correctAnswer": "Liquid volume of a small medicine spoon:Milliliters (mL)|Liquid volume of a large kitchen pitcher:Liters (L)|Weight of a single strawberry:Ounces (oz)|Weight of a third-grade student's backpack:Pounds (lb)",
                        "hint": "Remember: mL and L measure liquid volume (capacity), while oz and lb measure weight!",
                        "workedExplanation": "Small liquid amounts use mL, larger containers use L; light weights use oz (16 oz = 1 lb), heavier objects use lb.",
                        "isMiniAssessment": True
                    }
                ]
            }
        ]
    },
    # MODULE 3
    {
        "unitId": "unit-math-m3",
        "lessonNumber": 1,
        "topicCode": "Topics A–G",
        "title": "Lesson 1: Multiplicative Comparison, Facts of 6–9, and 2-Digit × 1-Digit Multiplication",
        "teks": ["3.4F", "3.4G", "3.4I", "3.5C", "3.5E"],
        "objective": "Solve multiplicative comparison problems, input-output tables, 6–9 facts, even/odd rules, and multiply 2-digit numbers by 1-digit numbers.",
        "sourcePdf": "BLMATH-G3-M3-Learn-ENG.pdf",
        "intro": "In Module 3, we master multiplication as comparison ('times as much'), input-output tables, strategies for units of 6, 7, 8, and 9, and multiplying two-digit numbers by one-digit numbers using area models and partial products!",
        "workedExample": {
            "id": "we-m3-l1",
            "title": "Two-Digit by One-Digit Multiplication with Partial Products",
            "problem": "There are 24 students in each third-grade class. How many students are in 3 third-grade classes? Solve 24 × 3.",
            "steps": [
                "Step 1 (Decompose by Place Value): Break 24 into 2 tens (20) and 4 ones (4).",
                "Step 2 (Multiply Tens): 20 × 3 = 60.",
                "Step 3 (Multiply Ones): 4 × 3 = 12.",
                "Step 4 (Add Partial Products): 60 + 12 = 72 students."
            ],
            "solution": "24 × 3 = 72 students.",
            "visualModelType": "area_model",
            "visualData": {"tens": 20, "ones": 4, "factor": 3, "partial1": 60, "partial2": 12}
        },
        "skills": [
            {
                "id": "skill-math-m3-1",
                "code": "M3.A.1",
                "title": "Multiplicative Comparisons, Input-Output Tables & Facts of 6–9",
                "teks": "3.5C",
                "difficulty": 2,
                "easierSkillId": "skill-math-m1-2",
                "questions": [
                    {
                        "id": "q-m3-1-1",
                        "type": "multiple_choice",
                        "difficulty": 1,
                        "teks": "3.5C",
                        "prompt": "Which statement accurately describes the multiplication expression 3 × 24 as a comparison (TEKS 3.5C)?",
                        "options": [
                            "3 times as much as 24",
                            "3 more than 24",
                            "24 divided into 3 groups",
                            "24 minus 3"
                        ],
                        "correctAnswer": "3 times as much as 24",
                        "hint": "In multiplicative comparison, the '×' symbol means 'times as much as'.",
                        "workedExplanation": "By TEKS 3.5C, 3 × 24 represents 3 times as much as 24."
                    },
                    {
                        "id": "q-m3-1-2",
                        "type": "fill_blank",
                        "difficulty": 2,
                        "teks": "3.4G",
                        "prompt": "Use partial products to multiply 23 × 4: (20 × 4) + (3 × 4) = 80 + 12 = ___",
                        "correctAnswer": "92",
                        "acceptableAnswers": ["92", "ninety-two"],
                        "hint": "Add the two partial products: 80 + 12.",
                        "workedExplanation": "20 × 4 = 80 and 3 × 4 = 12. Adding the partial products gives 80 + 12 = 92."
                    },
                    {
                        "id": "q-m3-1-3",
                        "type": "drag_drop",
                        "difficulty": 2,
                        "teks": "3.4I",
                        "prompt": "Sort these numbers into Even (divisible by 2) or Odd (not divisible by 2) using Module 3 Lesson 16's rule.",
                        "dragDropCategories": ["Even Number", "Odd Number"],
                        "dragDropItems": [
                            {"id": "eo-1", "label": "38", "category": "Even Number"},
                            {"id": "eo-2", "label": "47", "category": "Odd Number"},
                            {"id": "eo-3", "label": "90", "category": "Even Number"},
                            {"id": "eo-4", "label": "65", "category": "Odd Number"}
                        ],
                        "correctAnswer": "Even Number:38,90|Odd Number:47,65",
                        "hint": "Look at the digit in the ones place! Numbers ending in 0, 2, 4, 6, or 8 are divisible by 2.",
                        "workedExplanation": "38 and 90 end in 8 and 0 so they are divisible by 2 (Even). 47 and 65 end in 7 and 5 (Odd).",
                        "isMiniAssessment": True
                    }
                ]
            }
        ]
    },
    # MODULE 4
    {
        "unitId": "unit-math-m4",
        "lessonNumber": 1,
        "topicCode": "Topics A–B",
        "title": "Lesson 1: Area of Rectangles and Composite Figures",
        "teks": ["3.6C", "3.6D", "3.4F"],
        "objective": "Determine the area of rectangles using multiplication of rows times unit squares per row, and decompose composite figures into non-overlapping rectangles.",
        "sourcePdf": "BLMATH-G3-M4-Learn-ENG.pdf",
        "intro": "In Module 4, we connect our work with rectangular arrays to area measurement! We find the area of a rectangle by multiplying its side lengths (rows × unit squares in each row) and break L-shaped composite figures into smaller rectangles.",
        "workedExample": {
            "id": "we-m4-l1",
            "title": "Finding Area of a Composite Figure",
            "problem": "A patio is shaped like two connected rectangles. Rectangle A is 5 meters by 4 meters, and Rectangle B is 3 meters by 2 meters. What is the total area of the patio?",
            "steps": [
                "Step 1 (Area of Rectangle A): Multiply 5 rows × 4 square meters = 20 square meters.",
                "Step 2 (Area of Rectangle B): Multiply 3 rows × 2 square meters = 6 square meters.",
                "Step 3 (Additive Property of Area): Add the non-overlapping areas: 20 + 6 = 26 square meters."
            ],
            "solution": "26 square meters.",
            "visualModelType": "area_model",
            "visualData": {"rectA": "5 × 4 = 20", "rectB": "3 × 2 = 6", "total": 26}
        },
        "skills": [
            {
                "id": "skill-math-m4-1",
                "code": "M4.A.1",
                "title": "Calculate Area of Rectangles & Composite Figures",
                "teks": "3.6C",
                "difficulty": 2,
                "easierSkillId": "skill-math-m1-1",
                "questions": [
                    {
                        "id": "q-m4-1-1",
                        "type": "multiple_choice",
                        "difficulty": 1,
                        "teks": "3.6C",
                        "prompt": "Mara uses square centimeter tiles to make a rectangle with 6 rows and 8 tiles in each row. What is the area of Mara's rectangle?",
                        "options": ["48 square centimeters", "14 square centimeters", "28 square centimeters", "42 square centimeters"],
                        "correctAnswer": "48 square centimeters",
                        "hint": "Multiply the number of rows (6) by the number of square units in each row (8).",
                        "workedExplanation": "Area = 6 rows × 8 square centimeters per row = 48 square centimeters."
                    },
                    {
                        "id": "q-m4-1-2",
                        "type": "fill_blank",
                        "difficulty": 2,
                        "teks": "3.6C",
                        "prompt": "A rectangular garden has an area of 36 square feet. One side length is 4 feet. What is the unknown side length in feet?",
                        "correctAnswer": "9",
                        "acceptableAnswers": ["9", "9 feet", "nine"],
                        "hint": "Think: 4 × ___ = 36.",
                        "workedExplanation": "Since Area = length × width and 4 × 9 = 36, the unknown side length is 9 feet."
                    },
                    {
                        "id": "q-m4-1-3",
                        "type": "multiple_choice",
                        "difficulty": 2,
                        "teks": "3.6D",
                        "prompt": "A composite figure is decomposed into two non-overlapping rectangles. The top rectangle measures 4 cm by 5 cm, and the bottom rectangle measures 2 cm by 3 cm. What is the total area?",
                        "options": ["26 sq cm", "14 sq cm", "20 sq cm", "35 sq cm"],
                        "correctAnswer": "26 sq cm",
                        "hint": "Find the area of each rectangle (4 × 5 and 2 × 3) and add them together!",
                        "workedExplanation": "(4 × 5) + (2 × 3) = 20 + 6 = 26 sq cm.",
                        "isMiniAssessment": True
                    }
                ]
            }
        ]
    },
    # MODULE 5
    {
        "unitId": "unit-math-m5",
        "lessonNumber": 1,
        "topicCode": "Topics A–F",
        "title": "Lesson 1: Unit Fractions, Number Lines, Equivalent & Comparing Fractions",
        "teks": ["3.3A", "3.3B", "3.3D", "3.3F", "3.3H", "3.7A"],
        "objective": "Compose fractions from unit fractions, locate fractions on a number line between 0 and 1, find equivalent fractions, and compare fractions with like numerators or denominators.",
        "sourcePdf": "BLMATH-G3-M5-Learn-ENG.pdf",
        "intro": "In Module 5, we see that fractions are numbers that live on the number line! Every fraction is built from unit fractions (like 1/4 + 1/4 + 1/4 = 3/4), and we can compare fractions by reasoning about the size of the fractional units.",
        "workedExample": {
            "id": "we-m5-l1",
            "title": "Comparing Unit Fractions (Course Guide & Module 5 Topic C)",
            "problem": "Which fraction is greater: 1/6 or 1/8? Explain how you know.",
            "steps": [
                "Step 1 (Compare Wholes): Draw two identical rectangles or number lines from 0 to 1.",
                "Step 2 (Partition): Partition the first whole into 6 equal parts (sixths) and the second whole into 8 equal parts (eighths).",
                "Step 3 (Reason About Size): The more equal parts a whole is partitioned into, the smaller each part is.",
                "Step 4 (Compare): One sixth is larger than one eighth, so 1/6 > 1/8."
            ],
            "solution": "1/6 > 1/8 because sixths are larger parts than eighths.",
            "visualModelType": "number_line",
            "visualData": {"fractionA": "1/6", "fractionB": "1/8", "comparison": "1/6 > 1/8"}
        },
        "skills": [
            {
                "id": "skill-math-m5-1",
                "code": "M5.D.1",
                "title": "Unit Fractions, Number Line Fractions & Comparing Fractions",
                "teks": "3.3H",
                "difficulty": 2,
                "easierSkillId": "skill-math-m4-1",
                "questions": [
                    {
                        "id": "q-m5-1-1",
                        "type": "multiple_choice",
                        "difficulty": 1,
                        "teks": "3.3D",
                        "prompt": "Which sum of unit fractions decomposes the fraction 3/8?",
                        "options": [
                            "1/8 + 1/8 + 1/8",
                            "1/3 + 1/3 + 1/3",
                            "3/8 + 3/8 + 3/8",
                            "1/4 + 1/4"
                        ],
                        "correctAnswer": "1/8 + 1/8 + 1/8",
                        "hint": "A unit fraction always has a numerator of 1. How many copies of 1/8 make 3/8?",
                        "workedExplanation": "3/8 is 3 copies of the unit fraction 1/8: 1/8 + 1/8 + 1/8 = 3/8."
                    },
                    {
                        "id": "q-m5-1-2",
                        "type": "multiple_choice",
                        "difficulty": 2,
                        "teks": "3.3H",
                        "prompt": "Compare the two fractions with the same numerator: 2/3 ___ 2/6. Which symbol makes the comparison true?",
                        "options": [">", "<", "="],
                        "correctAnswer": ">",
                        "hint": "When numerators are the same, look at the fractional unit: are thirds bigger or smaller pieces than sixths?",
                        "workedExplanation": "Thirds are larger fractional parts than sixths (1/3 > 1/6), so 2 thirds is greater than 2 sixths: 2/3 > 2/6."
                    },
                    {
                        "id": "q-m5-1-3",
                        "type": "matching",
                        "difficulty": 2,
                        "teks": "3.3F",
                        "prompt": "Match each fraction on the left with its equivalent fraction on the right (Module 5 Topic E).",
                        "matchingPairs": [
                            {"left": "1/2", "right": "2/4"},
                            {"left": "1/3", "right": "2/6"},
                            {"left": "3/4", "right": "6/8"},
                            {"left": "1 whole", "right": "4/4"}
                        ],
                        "correctAnswer": "1/2:2/4|1/3:2/6|3/4:6/8|1 whole:4/4",
                        "hint": "Equivalent fractions land on the exact same point on the number line.",
                        "workedExplanation": "1/2 = 2/4 = 4/8; 1/3 = 2/6; 3/4 = 6/8; and 1 whole = 4/4.",
                        "isMiniAssessment": True
                    }
                ]
            }
        ]
    },
    # MODULE 6
    {
        "unitId": "unit-math-m6",
        "lessonNumber": 1,
        "topicCode": "Topics A–C",
        "title": "Lesson 1: Financial Literacy, Coins & Bills, Scaled Graphs & Dot Plots",
        "teks": ["3.4C", "3.8A", "3.8B", "3.9A", "3.9B", "3.9D", "3.9E"],
        "objective": "Determine the value of coins and bills, apply financial literacy concepts (income, scarcity, credit, saving), and solve problems using scaled bar graphs and dot plots.",
        "sourcePdf": "BLMATH-G3-M6-Learn-ENG.pdf",
        "intro": "In Module 6, we count bills and coins, explore how human capital and scarcity affect income and prices, learn about saving and credit, and analyze data in frequency tables, scaled bar graphs, and dot plots!",
        "workedExample": {
            "id": "we-m6-l1",
            "title": "Counting Bills and Coins & Supply and Demand",
            "problem": "Ben has one $5 bill, two $1 bills, 3 quarters, 2 dimes, and 1 nickel. How much money does Ben have in all?",
            "steps": [
                "Step 1 (Count Bills): $5 + $1 + $1 = $7.00.",
                "Step 2 (Count Quarters): 3 quarters = 25¢ + 25¢ + 25¢ = 75¢.",
                "Step 3 (Count Dimes and Nickel): 75¢ + 10¢ + 10¢ = 95¢; 95¢ + 5¢ = 100¢ = $1.00.",
                "Step 4 (Combine): $7.00 + $1.00 = $8.00."
            ],
            "solution": "$8.00",
            "visualModelType": "strip_diagram",
            "visualData": {"bills": "$7.00", "coins": "$1.00", "total": "$8.00"}
        },
        "skills": [
            {
                "id": "skill-math-m6-1",
                "code": "M6.A.1",
                "title": "Financial Literacy, Money Collections & Scaled Data Graphs",
                "teks": "3.4C",
                "difficulty": 1,
                "questions": [
                    {
                        "id": "q-m6-1-1",
                        "type": "multiple_choice",
                        "difficulty": 1,
                        "teks": "3.9B",
                        "prompt": "According to Module 6 Lesson 4 (TEKS 3.9B), what usually happens to the cost of berries when a freeze causes a scarcity (very low supply) of berries, but many customers still want to buy them?",
                        "options": [
                            "The cost of the berries increases.",
                            "The berries become free.",
                            "The cost of the berries drops to zero.",
                            "Scarcity has no effect on cost."
                        ],
                        "correctAnswer": "The cost of the berries increases.",
                        "hint": "When a resource is scarce (low availability) and demand is high, does the price go up or down?",
                        "workedExplanation": "When resources are scarce and demand remains high, the price/cost typically increases."
                    },
                    {
                        "id": "q-m6-1-2",
                        "type": "fill_blank",
                        "difficulty": 2,
                        "teks": "3.8B",
                        "prompt": "In a scaled bar graph from Module 6, the Baking Club has 9 students, Sports Club has 16 students, and Drama Club has 18 students. How many MORE students are in Drama and Sports combined than in Baking?",
                        "correctAnswer": "25",
                        "acceptableAnswers": ["25", "25 students"],
                        "hint": "Step 1: Add Drama + Sports (18 + 16). Step 2: Subtract Baking (9).",
                        "workedExplanation": "Step 1: 18 + 16 = 34 students. Step 2: 34 - 9 = 25 more students.",
                        "isMiniAssessment": True
                    }
                ]
            }
        ]
    },
    # MODULE 7
    {
        "unitId": "unit-math-m7",
        "lessonNumber": 1,
        "topicCode": "Topics A–E",
        "title": "Lesson 1: Classifying Quadrilaterals, 3D Solids, and Perimeter Problem Solving",
        "teks": ["3.6A", "3.6B", "3.7B", "3.4K"],
        "objective": "Classify 2D quadrilaterals and 3D solids by attributes, and calculate perimeter and unknown side lengths of polygons.",
        "sourcePdf": "BLMATH-G3-M7-Learn-ENG.pdf",
        "intro": "In Module 7, we classify 2D polygons (especially quadrilaterals like rhombuses, rectangles, squares, parallelograms, and trapezoids) and 3D solids, and solve perimeter and area word problems!",
        "workedExample": {
            "id": "we-m7-l1",
            "title": "Finding an Unknown Side Length from Perimeter",
            "problem": "A rectangular bulletin board has a perimeter of 28 feet. Its top side length is 8 feet. What is its width?",
            "steps": [
                "Step 1 (Opposite Sides of a Rectangle): Since the top is 8 feet, the bottom side is also 8 feet (8 + 8 = 16 feet).",
                "Step 2 (Subtract from Perimeter): Subtract 16 feet from the total perimeter: 28 - 16 = 12 feet remaining for the left and right sides.",
                "Step 3 (Divide by 2 Equal Widths): 12 ÷ 2 = 6 feet."
            ],
            "solution": "The width is 6 feet.",
            "visualModelType": "area_model",
            "visualData": {"perimeter": 28, "length": 8, "width": 6}
        },
        "skills": [
            {
                "id": "skill-math-m7-1",
                "code": "M7.B.1",
                "title": "Quadrilaterals, 3D Solids & Perimeter Unknown Side Lengths",
                "teks": "3.7B",
                "difficulty": 2,
                "easierSkillId": "skill-math-m4-1",
                "questions": [
                    {
                        "id": "q-m7-1-1",
                        "type": "multiple_choice",
                        "difficulty": 1,
                        "teks": "3.6A",
                        "prompt": "Which three-dimensional solid from Module 7 Lesson 7 has 5 faces (2 triangular bases and 3 rectangular faces), 9 edges, and 6 vertices?",
                        "options": ["Triangular prism", "Cylinder", "Cube", "Cone"],
                        "correctAnswer": "Triangular prism",
                        "hint": "Count the 2 triangle bases plus 3 connecting rectangles!",
                        "workedExplanation": "A triangular prism has 5 faces, 9 edges, and 6 vertices."
                    },
                    {
                        "id": "q-m7-1-2",
                        "type": "fill_blank",
                        "difficulty": 2,
                        "teks": "3.7B",
                        "prompt": "A regular hexagon (6 equal sides) has a perimeter of 42 centimeters. What is the length of each side in centimeters?",
                        "correctAnswer": "7",
                        "acceptableAnswers": ["7", "7 cm"],
                        "hint": "A regular hexagon has 6 equal sides. Divide 42 ÷ 6!",
                        "workedExplanation": "Since all 6 sides of a regular hexagon are equal, 42 ÷ 6 = 7 centimeters per side."
                    },
                    {
                        "id": "q-m7-1-3",
                        "type": "matching",
                        "difficulty": 2,
                        "teks": "3.6B",
                        "prompt": "Match each quadrilateral subcategory from TEKS 3.6B to its defining attribute.",
                        "matchingPairs": [
                            {"left": "Trapezoid", "right": "Quadrilateral with exactly one pair of parallel sides"},
                            {"left": "Parallelogram", "right": "Quadrilateral with two pairs of parallel sides"},
                            {"left": "Rhombus", "right": "Quadrilateral with 4 equal side lengths"},
                            {"left": "Square", "right": "Quadrilateral with 4 equal sides and 4 right angles"}
                        ],
                        "correctAnswer": "Trapezoid:Quadrilateral with exactly one pair of parallel sides|Parallelogram:Quadrilateral with two pairs of parallel sides|Rhombus:Quadrilateral with 4 equal side lengths|Square:Quadrilateral with 4 equal sides and 4 right angles",
                        "hint": "Look at parallel sides, equal side lengths, and right angles.",
                        "workedExplanation": "Trapezoids have 1 pair of parallel sides, parallelograms have 2 pairs, rhombuses have 4 equal sides, and squares have 4 equal sides and 4 right angles.",
                        "isMiniAssessment": True
                    }
                ]
            }
        ]
    }
]

for bp in math_lesson_blueprints:
    l_id = f"lesson-{bp['unitId']}-l{bp['lessonNumber']}"
    l_doc = {
        "id": l_id,
        "unitId": bp["unitId"],
        "subjectId": "subj-math",
        "lessonNumber": bp["lessonNumber"],
        "topicCode": bp["topicCode"],
        "title": bp["title"],
        "teks": bp["teks"],
        "objective": bp["objective"],
        "vocabulary": next(u["vocabulary"] for u in units if u["id"] == bp["unitId"]),
        "sections": {
            "introduction": bp["intro"],
            "learningObjective": bp["objective"],
            "examples": [bp["workedExample"]],
            "guidedPractice": [
                {
                    "prompt": f"Guided Check for {bp['title']}: Follow the Read–Draw–Write steps shown in the worked example above.",
                    "scaffoldSteps": bp["workedExample"]["steps"],
                    "checkQuestion": bp["workedExample"]["problem"],
                    "checkAnswer": bp["workedExample"]["solution"]
                }
            ],
            "independentPractice": [
                "Complete the interactive IXL-style skill practice sets below to build your SmartScore from 0 to 100.",
                "Use the Worked Example and Hint buttons whenever you want a step-by-step reminder before answering."
            ],
            "assessment": f"Mini-Assessment aligned to TEKS {', '.join(bp['teks'])} verifying conceptual understanding and procedural fluency.",
            "summary": f"Great job completing {bp['title']}! You practiced {', '.join(bp['teks'])} using Bluebonnet Read–Draw–Write representations."
        },
        "skillIds": [s["id"] for s in bp["skills"]],
        "estimatedMinutes": 25,
        "sourcePdf": bp["sourcePdf"],
        "order": bp["lessonNumber"]
    }
    sk_tuples = []
    for idx, s in enumerate(bp["skills"]):
        sk_doc = {
            "id": s["id"],
            "lessonId": l_id,
            "unitId": bp["unitId"],
            "subjectId": "subj-math",
            "code": s["code"],
            "title": s["title"],
            "description": bp["objective"],
            "teks": s["teks"],
            "difficulty": s["difficulty"],
            "easierSkillId": s.get("easierSkillId"),
            "nextSkillId": s.get("nextSkillId"),
            "workedExample": bp["workedExample"],
            "hints": [q["hint"] for q in s["questions"]],
            "miniAssessmentSummary": f"Mastery check for {s['code']} ({s['teks']})",
            "questionIds": [],
            "order": idx + 1
        }
        q_docs = []
        for q in s["questions"]:
            q_copy = dict(q)
            q_copy["skillId"] = s["id"]
            q_copy["lessonId"] = l_id
            q_copy["unitId"] = bp["unitId"]
            q_copy["subjectId"] = "subj-math"
            q_copy["audioInstruction"] = q["prompt"]
            q_docs.append(q_copy)
        sk_tuples.append((sk_doc, q_docs))
    add_bundle(l_doc, sk_tuples)

# ==============================================================================
# DOMAIN 2: READING LANGUAGE ARTS LESSONS, PASSAGES, SKILLS & QUESTIONS (U1-U10)
# ==============================================================================
rla_blueprints = [
    {
        "unitId": "unit-rla-u1",
        "title": "Lesson 1: Classic Tales — The Wind in the Willows ('The River Bank')",
        "teks": ["3.6G", "3.7C", "3.8A", "3.8B", "3.8C"],
        "objective": "Analyze character traits of Mole and Rat, sequence plot events, identify themes of friendship and hospitality, and use context clues.",
        "sourcePdf": "BLRLA-G3-U1-Teacher-ENG.pdf / BLFS-G3-Decodable-Passage-ENG.pdf (p. 3)",
        "passage": {
            "title": "The River Bank, Part I (from The Wind in the Willows)",
            "authorOrSource": "Kenneth Grahame • Bluebonnet Grade 3 Unit 1",
            "genre": "Classic Literary Tale (Fiction)",
            "lexileOrGrade": "Grade 3 • TEKS 3.8A–C",
            "skillWords": ["spring", "swept", "picnic", "basket", "lunch", "meandered"],
            "paragraphs": [
                "The Wind in the Willows follows the adventures of animals who live in the English countryside and act like people—a literary device called personification.",
                "The chapter 'The River Bank' begins with Mole doing his spring cleaning. He has swept and dusted his underground tunnel. Suddenly, he smells the fresh spring air outside. He drops his paint brush, scrambles up the tunnel, and skips happily across the warm meadow until he reaches a glistening river full to the brim.",
                "As Mole sits on the grassy bank watching the water meander by, a friendly Water Rat appears from a hole in the riverbank. Rat warmly invites Mole for his very first boat ride! Rat packs a generous picnic basket with cold chicken, crusty bread, and lemonade, and the two new friends float peacefully down the river together."
            ],
            "audioSummary": "Listen to 'The River Bank' from The Wind in the Willows and notice how Mole and Water Rat become friends."
        },
        "questions": [
            {
                "id": "q-rla-u1-1",
                "type": "reading_comprehension",
                "readingSubType": "Main Idea",
                "difficulty": 1,
                "teks": "3.6G",
                "prompt": "What is the main idea of this passage from 'The River Bank, Part I'?",
                "options": [
                    "Mole leaves his spring cleaning behind to explore the outdoors and begins a warm friendship with Water Rat on the river.",
                    "Mole finishes painting his entire underground house by himself.",
                    "Water Rat refuses to share his boat with anyone in the countryside.",
                    "Mole gets lost in the snowy Wild Wood during winter."
                ],
                "correctAnswer": "Mole leaves his spring cleaning behind to explore the outdoors and begins a warm friendship with Water Rat on the river.",
                "hint": "Look at what happens from the beginning of Mole's day to his picnic on the boat with Rat.",
                "workedExplanation": "The passage focuses on Mole leaving his underground spring cleaning to enjoy spring by the river, where he meets Water Rat and goes on a picnic boat ride."
            },
            {
                "id": "q-rla-u1-2",
                "type": "reading_comprehension",
                "readingSubType": "Theme",
                "difficulty": 2,
                "teks": "3.8A",
                "prompt": "When Water Rat gladly invites Mole onto his boat and packs a generous picnic basket to share, which theme of Unit 1 does Rat best demonstrate?",
                "options": ["Hospitality and friendship", "Irresponsibility and greed", "Revenge and anger", "Solitude and fear"],
                "correctAnswer": "Hospitality and friendship",
                "hint": "Hospitality means welcoming guests warmly and generously sharing food or shelter.",
                "workedExplanation": "Water Rat welcomes Mole kindly, shares his boat, and packs a picnic lunch for both of them, illustrating the themes of hospitality and friendship."
            },
            {
                "id": "q-rla-u1-3",
                "type": "vocabulary",
                "readingSubType": "Context Clues",
                "difficulty": 2,
                "teks": "3.3B",
                "prompt": "In paragraph 3, Mole watches the river 'meander' by. Based on Unit 1 vocabulary and context clues, what does 'meander' mean?",
                "options": [
                    "Wind or wander slowly and gently along a curving path",
                    "Freeze into solid ice overnight",
                    "Dry up completely in the desert sun",
                    "Explode loudly like a waterfall"
                ],
                "correctAnswer": "Wind or wander slowly and gently along a curving path",
                "hint": "Think about how a peaceful countryside river flows through a meadow.",
                "workedExplanation": "'Meander' means to wind or wander slowly and gently rather than moving in a straight, rushed line."
            },
            {
                "id": "q-rla-u1-4",
                "type": "sequencing",
                "readingSubType": "Sequencing",
                "difficulty": 2,
                "teks": "3.8C",
                "prompt": "Place these plot events from 'The River Bank, Part I' in chronological order from first to last.",
                "sequenceItems": [
                    "Mole sweeps, dusts, and mixes paint in his underground tunnel.",
                    "Mole smells the spring air and runs up his tunnel into the sunny meadow.",
                    "Mole arrives at the riverbank and meets the friendly Water Rat.",
                    "Rat packs a picnic basket and takes Mole on his first boat ride."
                ],
                "correctAnswer": "Mole sweeps, dusts, and mixes paint in his underground tunnel.|Mole smells the spring air and runs up his tunnel into the sunny meadow.|Mole arrives at the riverbank and meets the friendly Water Rat.|Rat packs a picnic basket and takes Mole on his first boat ride.",
                "hint": "Follow Mole's journey from underground to the meadow, to the riverbank, and finally onto the boat.",
                "workedExplanation": "First Mole cleans underground, then he goes outside to the meadow, next he meets Rat at the river, and finally they go on a picnic boat ride.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-rla-u2",
        "title": "Lesson 1: Scales, Feathers, and Fur — Rattenborough's Guide to Animal Classification",
        "teks": ["3.6G", "3.9D.i", "3.9D.ii", "3.10A"],
        "objective": "Identify central ideas, text features, author's purpose, and classify vertebrates and invertebrates.",
        "sourcePdf": "BLRLA-G3-U2-Reader-ENG.pdf (pp. 1–24)",
        "passage": {
            "title": "Meet Rattenborough & Classifying Vertebrates",
            "authorOrSource": "Rattenborough's Guide to Animals • Bluebonnet Grade 3 Unit 2",
            "genre": "Informational Science Text",
            "lexileOrGrade": "Grade 3 • TEKS 3.9D",
            "skillWords": ["vertebrate", "invertebrate", "warm-blooded", "cold-blooded", "habitat"],
            "paragraphs": [
                "Greetings! Rattenborough, the famous explorer and animal expert, here! Scientists classify—or sort—animals into groups based on shared characteristics so we can understand how living things are related.",
                "One of the most important ways taxonomists classify animals is by asking: Does this animal have a backbone? Animals with a backbone are called vertebrates. Animals without a backbone, such as insects, spiders, crabs, and jellyfish, are called invertebrates. In fact, more than 95 percent of all animal species on Earth are invertebrates!",
                "Scientists further classify vertebrates into five main groups: fish, amphibians, reptiles, birds, and mammals. Fish, amphibians, and reptiles are cold-blooded—their body temperature changes with their surroundings. Birds and mammals are warm-blooded—their bodies maintain a constant internal temperature whether it is snowy or hot outside!"
            ],
            "audioSummary": "Read Rattenborough's explanation of how scientists classify animals into vertebrates and invertebrates."
        },
        "questions": [
            {
                "id": "q-rla-u2-1",
                "type": "reading_comprehension",
                "readingSubType": "Author Purpose",
                "difficulty": 1,
                "teks": "3.10A",
                "prompt": "What is the author's primary purpose for writing this selection in 'Rattenborough's Guide to Animals'?",
                "options": [
                    "To inform readers how scientists classify animals by backbones and body temperature",
                    "To persuade readers to buy a pet lizard from a pet store",
                    "To tell a fairy tale about a magical talking frog",
                    "To explain how to build a wooden birdhouse"
                ],
                "correctAnswer": "To inform readers how scientists classify animals by backbones and body temperature",
                "hint": "Does the passage give scientific facts and definitions about animal groups?",
                "workedExplanation": "The author's purpose is to inform readers about how scientists classify animals into vertebrates/invertebrates and warm-blooded/cold-blooded groups."
            },
            {
                "id": "q-rla-u2-2",
                "type": "reading_comprehension",
                "readingSubType": "Inference",
                "difficulty": 2,
                "teks": "3.6F",
                "prompt": "Based on paragraph 3, what can you infer about a reptile (such as an alligator or lizard) on a cold winter morning?",
                "options": [
                    "Its body temperature will drop and match the cool air until it warms up in the sun.",
                    "Its body will automatically stay at 98.6°F just like a human.",
                    "It will grow feathers to stay warm.",
                    "It is an invertebrate without a backbone."
                ],
                "correctAnswer": "Its body temperature will drop and match the cool air until it warms up in the sun.",
                "hint": "Paragraph 3 states that reptiles are cold-blooded and their body temperature changes with their surroundings.",
                "workedExplanation": "Because reptiles are cold-blooded vertebrates, their internal temperature changes with the environment around them."
            },
            {
                "id": "q-rla-u2-3",
                "type": "drag_drop",
                "readingSubType": "Main Idea",
                "difficulty": 2,
                "teks": "3.9D.i",
                "prompt": "Sort each animal group into Warm-Blooded Vertebrates or Cold-Blooded Vertebrates.",
                "dragDropCategories": ["Warm-Blooded Vertebrates", "Cold-Blooded Vertebrates"],
                "dragDropItems": [
                    {"id": "an-1", "label": "Mammals (dolphins, bears, humans)", "category": "Warm-Blooded Vertebrates"},
                    {"id": "an-2", "label": "Birds (eagles, penguins, parrots)", "category": "Warm-Blooded Vertebrates"},
                    {"id": "an-3", "label": "Reptiles (snakes, turtles, lizards)", "category": "Cold-Blooded Vertebrates"},
                    {"id": "an-4", "label": "Amphibians (frogs, toads, salamanders)", "category": "Cold-Blooded Vertebrates"}
                ],
                "correctAnswer": "Warm-Blooded Vertebrates:Mammals (dolphins, bears, humans),Birds (eagles, penguins, parrots)|Cold-Blooded Vertebrates:Reptiles (snakes, turtles, lizards),Amphibians (frogs, toads, salamanders)",
                "hint": "Check paragraph 3: which two vertebrate groups keep a constant internal body temperature?",
                "workedExplanation": "Birds and mammals are warm-blooded vertebrates; fish, amphibians, and reptiles are cold-blooded vertebrates.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-rla-u3",
        "title": "Lesson 1: The Human Body — Skeletal, Muscular, and Nervous Systems",
        "teks": ["3.6F", "3.6G", "3.7C", "3.9D.i"],
        "objective": "Synthesize details about how bones, joints, muscles, and nerves work together in the human body.",
        "sourcePdf": "BLRLA-G3-U3-Teacher-ENG.pdf / BLFS-G3-Decodable-Passage-ENG.pdf (p. 13)",
        "passage": {
            "title": "How Do Your Skeleton, Joints, and Muscles Help You Move?",
            "authorOrSource": "Dr. Welbody • Bluebonnet Grade 3 Unit 3",
            "genre": "Informational Health & Science Text",
            "lexileOrGrade": "Grade 3 • TEKS 3.6G",
            "skillWords": ["skeleton", "cartilage", "ligaments", "tendons", "voluntary", "nervous"],
            "paragraphs": [
                "Your skeletal system is made up of more than 200 bones that give your body its strong shape and protect vital organs. Your skull protects your brain like a helmet, and your rib cage shields your heart and lungs.",
                "Where two bones meet is called a joint. Strong elastic bands called ligaments hold bones together at joints, while smooth, flexible cartilage cushions the bones so they do not grind against each other.",
                "Bones cannot move by themselves! Skeletal muscles are attached to bones by tough cords called tendons. When your brain sends an electrical message through your nervous system, voluntary muscles contract and pull on your bones so you can run, jump, and write!"
            ],
            "audioSummary": "Learn how the skeletal, muscular, and nervous systems team up to help you move."
        },
        "questions": [
            {
                "id": "q-rla-u3-1",
                "type": "reading_comprehension",
                "readingSubType": "Main Idea",
                "difficulty": 1,
                "teks": "3.6G",
                "prompt": "What is the central idea of this passage from Unit 3?",
                "options": [
                    "The skeletal, muscular, and nervous systems work together so the human body can stand, protect organs, and move.",
                    "The human body only has ten bones in total.",
                    "Muscles can move the body without any help from bones or the brain.",
                    "Cartilage is only found in the stomach."
                ],
                "correctAnswer": "The skeletal, muscular, and nervous systems work together so the human body can stand, protect organs, and move.",
                "hint": "Look at how all three paragraphs connect bones, joints, muscles, and the brain.",
                "workedExplanation": "The passage explains how bones support and protect the body, joints and cartilage allow bending, and muscles triggered by the nervous system pull on bones to create movement."
            },
            {
                "id": "q-rla-u3-2",
                "type": "matching",
                "readingSubType": "Context Clues",
                "difficulty": 2,
                "teks": "3.3B",
                "prompt": "Match each human body term from Unit 3 with its role described in the text.",
                "matchingPairs": [
                    {"left": "Ligaments", "right": "Connect bone to bone at a joint"},
                    {"left": "Tendons", "right": "Attach skeletal muscles to bones"},
                    {"left": "Cartilage", "right": "Flexible tissue that cushions bones at joints"},
                    {"left": "Skull", "right": "Bony helmet that protects the brain"}
                ],
                "correctAnswer": "Ligaments:Connect bone to bone at a joint|Tendons:Attach skeletal muscles to bones|Cartilage:Flexible tissue that cushions bones at joints|Skull:Bony helmet that protects the brain",
                "hint": "Check paragraphs 1, 2, and 3 for the bolded body structures.",
                "workedExplanation": "Ligaments join bone to bone, tendons attach muscle to bone, cartilage cushions joints, and the skull protects the brain.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-rla-u4",
        "title": "Lesson 1: The Ancient Roman Civilization — Republic, Empire & Architecture",
        "teks": ["3.6F", "3.6G", "3.9D", "3.10A"],
        "objective": "Analyze Roman historical texts and myths, identify key Roman contributions, and use context clues.",
        "sourcePdf": "BLRLA-G3-U4-Teacher-ENG.pdf / BLFS-G3-Decodable-Passage-ENG.pdf (p. 16)",
        "passage": {
            "title": "Rome, Then and Now & The Pantheon",
            "authorOrSource": "Stories of Ancient Rome • Bluebonnet Grade 3 Unit 4",
            "genre": "Historical Nonfiction",
            "lexileOrGrade": "Grade 3 • TEKS 3.6G",
            "skillWords": ["republic", "patricians", "plebeians", "aqueduct", "Pantheon"],
            "paragraphs": [
                "Over two thousand years ago, Rome grew from a small village along the Tiber River in Italy into one of the greatest civilizations in history. After overthrowing their kings, Romans established a republic—a government where citizens elected senators and consuls to represent them.",
                "In the early Roman Republic, wealthy patricians held the most power, while ordinary working citizens, called plebeians, had very few rights until they united to demand fair written laws.",
                "Romans were master builders and engineers. They constructed stone aqueducts to carry fresh water across valleys into cities, paved thousands of miles of roads, and built magnificent domes like the Pantheon, which still stands in Rome today with an open oculus at the top!"
            ],
            "audioSummary": "Explore how Ancient Rome established a republic and engineered roads, aqueducts, and the Pantheon."
        },
        "questions": [
            {
                "id": "q-rla-u4-1",
                "type": "reading_comprehension",
                "readingSubType": "Context Clues",
                "difficulty": 1,
                "teks": "3.3B",
                "prompt": "In paragraph 1, what context clue helps define the word 'republic'?",
                "options": [
                    "'a government where citizens elected senators and consuls to represent them'",
                    "'a small village along the Tiber River in Italy'",
                    "'stone aqueducts to carry fresh water'",
                    "'an open oculus at the top'"
                ],
                "correctAnswer": "'a government where citizens elected senators and consuls to represent them'",
                "hint": "Look right after the dash following the word 'republic' in paragraph 1!",
                "workedExplanation": "The author defines 'republic' directly after the dash as 'a government where citizens elected senators and consuls to represent them.'",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-rla-u5",
        "title": "Lesson 1: Flash, Bang, Boom! Exploring Light and Sound",
        "teks": ["3.6G", "3.9D.iii", "3.10A"],
        "objective": "Identify cause-and-effect relationships in scientific texts about light reflection, refraction, and sound waves.",
        "sourcePdf": "BLRLA-G3-U5-Teacher-ENG.pdf / BLFS-G3-Decodable-Passage-ENG.pdf (p. 20)",
        "passage": {
            "title": "What Is Light, Refraction, and Sound?",
            "authorOrSource": "Adventures in Light and Sound • Bluebonnet Grade 3 Unit 5",
            "genre": "Informational Science Text",
            "lexileOrGrade": "Grade 3 • TEKS 3.9D.iii",
            "skillWords": ["wavelength", "transparent", "opaque", "refraction", "vibration"],
            "paragraphs": [
                "Light is a form of energy that travels in straight lines called rays at an astonishing speed of 186,000 miles per second! Light can pass easily through transparent materials like clear glass, but opaque objects block light rays and cast a dark shadow.",
                "When light rays pass from one transparent medium into another—such as from air into a glass of water—the light changes speed and bends. Scientists call this bending of light refraction. Convex lenses in eyeglasses and telescopes use refraction to focus light!",
                "Unlike light, which can travel through empty space, sound requires a medium (solid, liquid, or gas) to travel. Every sound begins with a back-and-forth vibration. Fast vibrations produce a high-pitched sound, while slow vibrations produce a low-pitched sound."
            ],
            "audioSummary": "Discover how light rays reflect and refract, and how vibrations create high and low sound waves."
        },
        "questions": [
            {
                "id": "q-rla-u5-1",
                "type": "reading_comprehension",
                "readingSubType": "Inference",
                "difficulty": 2,
                "teks": "3.6F",
                "prompt": "Based on paragraph 3, why can astronauts in outer space see the Sun shining brightly, but cannot hear sounds through the empty vacuum of space without radios?",
                "options": [
                    "Light can travel through empty space, but sound waves require a medium (solid, liquid, or gas) to travel.",
                    "Sound travels faster than light in outer space.",
                    "Outer space is completely opaque and blocks all light.",
                    "Astronaut helmets block light rays from entering."
                ],
                "correctAnswer": "Light can travel through empty space, but sound waves require a medium (solid, liquid, or gas) to travel.",
                "hint": "Read the first sentence of paragraph 3 carefully!",
                "workedExplanation": "Paragraph 3 explains that unlike light, which travels through empty space, sound waves require matter (a solid, liquid, or gas medium) to vibrate.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-rla-u6",
        "title": "Lesson 1: Astronomy — Our Solar System, Galaxies, and Gravity",
        "teks": ["3.6G", "3.9D", "3.10A"],
        "objective": "Synthesize key ideas about inner and outer planets, gravity, and galaxies in Our Solar System and Beyond.",
        "sourcePdf": "BLRLA-G3-U6-Teacher-ENG.pdf / BLFS-G3-Decodable-Passage-ENG.pdf (p. 24)",
        "passage": {
            "title": "Our Solar System and All About Gravity",
            "authorOrSource": "What's in Our Universe? • Bluebonnet Grade 3 Unit 6",
            "genre": "Informational Science Text",
            "lexileOrGrade": "Grade 3 • TEKS 3.6G",
            "skillWords": ["orbit", "gravity", "asteroid", "galaxy", "equinox"],
            "paragraphs": [
                "At the center of our solar system shines the Sun, a medium-sized star whose immense gravity holds eight planets in elliptical orbits. The four inner planets—Mercury, Venus, Earth, and Mars—are rocky terrestrial planets closest to the Sun.",
                "Beyond the asteroid belt orbit the four huge outer gas giants: Jupiter, Saturn, Uranus, and Neptune. Gravity is the invisible force of attraction between all objects with mass. The more mass an object has, the stronger its gravitational pull!",
                "Our entire solar system is just one tiny part of the Milky Way, a spiral galaxy containing billions of stars. Beyond the Milky Way lie billions of other galaxies, such as our neighbor, the Andromeda Galaxy!"
            ],
            "audioSummary": "Explore the inner rocky planets, outer gas giants, gravity, and the Milky Way galaxy."
        },
        "questions": [
            {
                "id": "q-rla-u6-1",
                "type": "reading_comprehension",
                "readingSubType": "Main Idea",
                "difficulty": 1,
                "teks": "3.6G",
                "prompt": "Which statement best summarizes the difference between the four inner planets and the four outer planets in Unit 6?",
                "options": [
                    "The inner planets (Mercury, Venus, Earth, Mars) are rocky planets close to the Sun, while the outer planets (Jupiter, Saturn, Uranus, Neptune) are huge gas giants beyond the asteroid belt.",
                    "All eight planets are made entirely of solid ice.",
                    "The outer planets are closer to the Sun than Mercury and Earth.",
                    "Earth is the largest gas giant in the Andromeda Galaxy."
                ],
                "correctAnswer": "The inner planets (Mercury, Venus, Earth, Mars) are rocky planets close to the Sun, while the outer planets (Jupiter, Saturn, Uranus, Neptune) are huge gas giants beyond the asteroid belt.",
                "hint": "Compare paragraph 1 (inner planets) and paragraph 2 (outer planets).",
                "workedExplanation": "Mercury, Venus, Earth, and Mars are rocky inner planets; Jupiter, Saturn, Uranus, and Neptune are outer gas giants beyond the asteroid belt.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-rla-u7",
        "title": "Lesson 1: Native American Regions and Cultures (Including the Caddo & Tejas of Texas)",
        "teks": ["3.6F", "3.6G", "3.8B", "3.9D"],
        "objective": "Explain how Native American nations adapted to their environments, including the Pueblo of the Southwest and the Caddo of Texas.",
        "sourcePdf": "BLRLA-G3-U7-Teacher-ENG.pdf",
        "passage": {
            "title": "Native Americans of the Southwest and the Caddo of Texas",
            "authorOrSource": "Native American Stories • Bluebonnet Grade 3 Unit 7",
            "genre": "Historical & Cultural Nonfiction",
            "lexileOrGrade": "Grade 3 • TEKS 3.6G",
            "skillWords": ["adobe", "irrigation", "Caddo", "Tejas", "confederacy"],
            "paragraphs": [
                "Across North America, Native American nations developed ingenious ways of living from the land. In the dry Southwest, Pueblo peoples built multi-story villages out of sun-dried adobe clay bricks and dug irrigation canals to water fields of corn, beans, and squash.",
                "In the fertile piney woods and river valleys of East Texas lived the Caddo nation. The Caddo were skilled farmers, potters, and traders who lived in tall, beehive-shaped grass houses framed with sturdy wooden poles.",
                "The Caddo formed a peaceful confederacy called the Hasinai. Their word for 'friends' or 'allies' was Tejas—which Spanish explorers later used to name the state of Texas!"
            ],
            "audioSummary": "Learn how the Pueblo peoples of the Southwest and the Caddo nation of East Texas adapted to their lands."
        },
        "questions": [
            {
                "id": "q-rla-u7-1",
                "type": "reading_comprehension",
                "readingSubType": "Main Idea",
                "difficulty": 1,
                "teks": "3.6G",
                "prompt": "According to the passage from Unit 7, where does the name 'Texas' originate?",
                "options": [
                    "From the Caddo word 'Tejas', meaning 'friends' or 'allies'",
                    "From a Roman emperor's name",
                    "From an Arctic word for snow",
                    "From the name of Christopher Columbus's ship"
                ],
                "correctAnswer": "From the Caddo word 'Tejas', meaning 'friends' or 'allies'",
                "hint": "Look at the last sentence of paragraph 3!",
                "workedExplanation": "The Caddo Hasinai confederacy used the word 'Tejas' meaning 'friends' or 'allies', which became the name of Texas.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-rla-u8",
        "title": "Lesson 1: Early Explorations of North America",
        "teks": ["3.6G", "3.7C", "3.9D"],
        "objective": "Identify the motivations, routes, and historical impacts of early European explorers of North America.",
        "sourcePdf": "BLRLA-G3-U8-Teacher-ENG.pdf",
        "passage": {
            "title": "Explorers of the Southwest and the Search for the Northwest Passage",
            "authorOrSource": "The Age of Exploration • Bluebonnet Grade 3 Unit 8",
            "genre": "Historical Nonfiction",
            "lexileOrGrade": "Grade 3 • TEKS 3.6G",
            "skillWords": ["expedition", "conquistador", "navigation", "Northwest Passage", "canyon"],
            "paragraphs": [
                "In the 1500s and 1600s, European explorers sailed across the Atlantic Ocean searching for new trade routes to Asia and riches in the Americas. Spanish explorers such as Juan Ponce de León explored Florida, while Hernando de Soto led the first European expedition to cross the Mississippi River.",
                "In 1540, Francisco Vásquez de Coronado led an expedition across the American Southwest, becoming the first Europeans to see the Grand Canyon and marching across the flat plains of the Texas Panhandle (the Llano Estacado).",
                "Meanwhile, northern explorers—including John Cabot for England, Henry Hudson for the Dutch and English, and Samuel de Champlain for France—searched the icy waters of North America for a waterway to Asia called the Northwest Passage."
            ],
            "audioSummary": "Trace the expeditions of Ponce de León, De Soto, Coronado, Cabot, Hudson, and Champlain."
        },
        "questions": [
            {
                "id": "q-rla-u8-1",
                "type": "matching",
                "readingSubType": "Main Idea",
                "difficulty": 2,
                "teks": "3.6G",
                "prompt": "Match each explorer studied in Bluebonnet Unit 8 to the region they explored.",
                "matchingPairs": [
                    {"left": "Juan Ponce de León", "right": "Explored and named Florida"},
                    {"left": "Hernando de Soto", "right": "First European expedition to cross the Mississippi River"},
                    {"left": "Francisco Vásquez de Coronado", "right": "Explored the American Southwest, Grand Canyon, and Texas Panhandle"},
                    {"left": "Samuel de Champlain", "right": "Founded Quebec in Canada and explored for France"}
                ],
                "correctAnswer": "Juan Ponce de León:Explored and named Florida|Hernando de Soto:First European expedition to cross the Mississippi River|Francisco Vásquez de Coronado:Explored the American Southwest, Grand Canyon, and Texas Panhandle|Samuel de Champlain:Founded Quebec in Canada and explored for France",
                "hint": "Check paragraphs 1, 2, and 3 for each explorer's name.",
                "workedExplanation": "Ponce de León explored Florida, De Soto crossed the Mississippi, Coronado explored the Southwest/Texas Panhandle, and Champlain founded Quebec.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-rla-u9",
        "title": "Lesson 1: Living in Colonial America",
        "teks": ["3.6G", "3.8C", "3.9D"],
        "objective": "Compare the Southern, New England, and Middle Colonies and explain key events leading to American independence.",
        "sourcePdf": "BLRLA-G3-U9-Teacher-ENG.pdf",
        "passage": {
            "title": "From Jamestown and Plymouth to the Thirteen Colonies",
            "authorOrSource": "Living in Colonial America • Bluebonnet Grade 3 Unit 9",
            "genre": "Historical Nonfiction & Narrative",
            "lexileOrGrade": "Grade 3 • TEKS 3.6G",
            "skillWords": ["colony", "Mayflower Compact", "self-government", "Quakers", "apprentice"],
            "paragraphs": [
                "In 1607, English settlers founded Jamestown in Virginia, the first permanent English colony in North America. Thirteen years later, in 1620, the Pilgrims sailed aboard the Mayflower to Plymouth, Massachusetts, signing the Mayflower Compact—an agreement for self-government.",
                "Over time, thirteen English colonies developed across three distinct regions. The New England Colonies had rocky soil and cold winters, so colonists built ships, fished, and traded timber. The Middle Colonies—like Pennsylvania, founded by William Penn and the Quakers—grew so much wheat and grain they were called the 'Breadbasket Colonies.' The Southern Colonies had warm climates and long growing seasons for large farms.",
                "By the 1770s, colonists protested British taxes made without colonial representation in Parliament, leading to the Boston Tea Party and the road to American independence!"
            ],
            "audioSummary": "Explore Jamestown, Plymouth, the New England, Middle, and Southern Colonies, and the Road to Revolution."
        },
        "questions": [
            {
                "id": "q-rla-u9-1",
                "type": "reading_comprehension",
                "readingSubType": "Main Idea",
                "difficulty": 1,
                "teks": "3.6G",
                "prompt": "Why were the Middle Colonies (such as Pennsylvania, New York, New Jersey, and Delaware) nicknamed the 'Breadbasket Colonies' in Unit 9?",
                "options": [
                    "Their fertile soil and mild climate allowed farmers to grow abundant wheat, rye, and barley used to make bread.",
                    "They woven baskets out of pine needles in winter.",
                    "They only ate fish and whale blubber.",
                    "They imported all of their bread from Spain."
                ],
                "correctAnswer": "Their fertile soil and mild climate allowed farmers to grow abundant wheat, rye, and barley used to make bread.",
                "hint": "Look at what crops the Middle Colonies grew in paragraph 2!",
                "workedExplanation": "The Middle Colonies grew vast amounts of grain (wheat, rye, barley) that fed the colonies, earning the nickname 'Breadbasket Colonies.'",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-rla-u10",
        "title": "Lesson 1: All That Jazz — Harlem Renaissance, Louis Armstrong & Research Inquiry",
        "teks": ["3.6G", "3.10D", "3.13A", "3.13C"],
        "objective": "Determine central ideas in jazz biographies, understand improvisation, and identify reliable primary and secondary research sources.",
        "sourcePdf": "BLRLA-G3-U10-Teacher-ENG.pdf",
        "passage": {
            "title": "The Jazz Age, Louis Armstrong, and Duke Ellington",
            "authorOrSource": "All That Jazz • Bluebonnet Grade 3 Unit 10",
            "genre": "Biography & Cultural History",
            "lexileOrGrade": "Grade 3 • TEKS 3.6G / 3.13C",
            "skillWords": ["jazz", "improvisation", "Harlem Renaissance", "rhythm", "symphony"],
            "paragraphs": [
                "Born in New Orleans from a rich blend of African and European musical traditions, blues, and ragtime, jazz is a uniquely American art form celebrated around the world. A hallmark of jazz is improvisation—when musicians invent fresh melodies on the spot while performing together!",
                "During the 1920s and 1930s, jazz became the heartbeat of the Harlem Renaissance in New York City, where writers like Langston Hughes and musicians like trumpeter Louis Armstrong, singer Billie Holiday, and bandleader Duke Ellington transformed American culture.",
                "Later, musicians like Tito Puente blended Afro-Cuban percussion—such as timbales, bongos, and conga drums—with jazz harmonies to create lively Latin jazz and mambo rhythms!"
            ],
            "audioSummary": "Discover the roots of jazz in New Orleans, the Harlem Renaissance, Louis Armstrong, Duke Ellington, and Tito Puente."
        },
        "questions": [
            {
                "id": "q-rla-u10-1",
                "type": "vocabulary",
                "readingSubType": "Context Clues",
                "difficulty": 1,
                "teks": "3.3B",
                "prompt": "In Unit 10 ('All That Jazz'), what does musical 'improvisation' mean?",
                "options": [
                    "Creating and performing new melodies spontaneously in the moment",
                    "Reading every note silently without playing an instrument",
                    "Playing a recording backward on a gramophone",
                    "Repairing a broken trumpet valve"
                ],
                "correctAnswer": "Creating and performing new melodies spontaneously in the moment",
                "hint": "Check paragraph 1 right after the word 'improvisation'!",
                "workedExplanation": "Improvisation is the art of creating music spontaneously in the moment while performing.",
                "isMiniAssessment": True
            }
        ]
    }
]

for bp in rla_blueprints:
    l_id = f"lesson-{bp['unitId']}-l1"
    s_id = f"skill-{bp['unitId']}-1"
    u_num = int(bp["unitId"].split("-u")[1])
    we = {
        "id": f"we-{bp['unitId']}",
        "title": f"Text Evidence & Close Reading Strategy ({bp['passage']['title']})",
        "problem": bp["questions"][0]["prompt"],
        "steps": [
            "Step 1 (Read the Passage): Read the Bluebonnet Reader passage carefully, paying attention to highlighted skill words.",
            "Step 2 (Locate Text Evidence): Find the paragraph and sentence that directly addresses the question.",
            "Step 3 (Eliminate Distractors): Cross out choices that contradict or are not supported by the text.",
            "Step 4 (Verify): Confirm your answer matches the author's words and central idea."
        ],
        "solution": bp["questions"][0]["correctAnswer"],
        "visualModelType": "text_evidence"
    }
    l_doc = {
        "id": l_id,
        "unitId": bp["unitId"],
        "subjectId": "subj-rla",
        "lessonNumber": 1,
        "topicCode": f"Unit {u_num}",
        "title": bp["title"],
        "teks": bp["teks"],
        "objective": bp["objective"],
        "vocabulary": next(u["vocabulary"] for u in units if u["id"] == bp["unitId"]),
        "sections": {
            "introduction": f"Welcome to {bp['title']}! Read the authentic Bluebonnet Reader passage below and use the Text-to-Speech Read-Aloud button if you'd like to listen along.",
            "learningObjective": bp["objective"],
            "examples": [we],
            "guidedPractice": [
                {
                    "prompt": f"Close Reading Check for {bp['passage']['title']}",
                    "scaffoldSteps": we["steps"],
                    "checkQuestion": bp["questions"][0]["prompt"],
                    "checkAnswer": bp["questions"][0]["correctAnswer"]
                }
            ],
            "independentPractice": [
                "Read the passage carefully and answer the comprehension, vocabulary, inference, theme, and sequencing questions.",
                "Look back at the numbered paragraphs to find text evidence for every answer."
            ],
            "assessment": f"Reading Comprehension & Vocabulary Check aligned to {', '.join(bp['teks'])}.",
            "summary": f"You completed {bp['title']} and practiced finding text evidence, central ideas, and vocabulary in context!"
        },
        "readingPassage": bp["passage"],
        "skillIds": [s_id],
        "estimatedMinutes": 25,
        "sourcePdf": bp["sourcePdf"],
        "order": 1
    }
    sk_doc = {
        "id": s_id,
        "lessonId": l_id,
        "unitId": bp["unitId"],
        "subjectId": "subj-rla",
        "code": f"RLA.{u_num}.1",
        "title": bp["title"].split(": ", 1)[1],
        "description": bp["objective"],
        "teks": bp["teks"][0],
        "difficulty": 1 if u_num <= 3 else 2,
        "easierSkillId": "skill-unit-rla-u1-1" if u_num > 1 else None,
        "workedExample": we,
        "hints": [q["hint"] for q in bp["questions"]],
        "miniAssessmentSummary": f"Unit {u_num} Reading & Vocabulary Mastery Check",
        "questionIds": [],
        "order": 1
    }
    q_docs = []
    for q in bp["questions"]:
        q_copy = dict(q)
        q_copy["skillId"] = s_id
        q_copy["lessonId"] = l_id
        q_copy["unitId"] = bp["unitId"]
        q_copy["subjectId"] = "subj-rla"
        q_copy["passageExcerpt"] = "\n\n".join(bp["passage"]["paragraphs"])
        q_copy["audioInstruction"] = q["prompt"]
        q_docs.append(q_copy)
    add_bundle(l_doc, [(sk_doc, q_docs)])

# ==============================================================================
# DOMAIN 3: FOUNDATIONAL SKILLS LESSONS, ACTIVITIES, SKILLS & QUESTIONS (U1-U10)
# ==============================================================================
fs_blueprints = [
    {
        "unitId": "unit-fs-u1",
        "title": "Lesson 1: Digraphs (ph, kn, tch, dge), Trigraphs & VC/CV Syllable Division",
        "teks": ["3.2A.ii", "3.2A.iv", "3.2B.i", "3.2B.v"],
        "objective": "Decode and spell words with consonant digraphs/trigraphs (tch, dge, ph, kn, igh) and divide VC/CV closed-syllable words.",
        "phonicsFocus": "Digraphs (wh, sh, th, ck, ch/tch, dge/ge, ph/gh, kn/gn) & VC/CV Closed Syllables",
        "fluencyPassage": "From Campfire Tales (Unit 1 Reader): The campers packed a picnic basket and walked across the wooden bridge at night. A knight with a bright lantern told a funny story that made everyone laugh!",
        "wordBuilding": [
            {"targetWord": "picnic", "syllables": ["pic", "nic"], "hint": "Divide between the two consonants in the VC/CV pattern: pic + nic."},
            {"targetWord": "basket", "syllables": ["bas", "ket"], "hint": "Divide between s and k in the VC/CV pattern: bas + ket."},
            {"targetWord": "bridge", "syllables": ["br", "i", "dge"], "hint": "After a short vowel, the /j/ sound at the end of a syllable is spelled with trigraph dge."}
        ],
        "soundMatches": [
            {"soundPrompt": "Which word uses the advanced digraph 'ph' to make the /f/ sound?", "phoneme": "/f/ spelled ph", "correctWord": "dolphin", "distractors": ["bridge", "knight", "catch"]},
            {"soundPrompt": "Which word uses the trigraph 'dge' to make the /j/ sound after a short vowel?", "phoneme": "/j/ spelled dge", "correctWord": "badge", "distractors": ["phone", "graph", "gnat"]}
        ],
        "questions": [
            {
                "id": "q-fs-u1-1",
                "type": "multiple_choice",
                "foundationalActivityType": "Match Sound",
                "difficulty": 1,
                "teks": "3.2A.ii",
                "prompt": "Listen to the sound /f/. Which word from Foundational Skills Unit 1 Lesson 7 uses the advanced digraph 'ph' to spell the /f/ sound?",
                "options": ["phantom", "kettle", "pledge", "knuckle"],
                "correctAnswer": "phantom",
                "hint": "Look for the two letters 'p-h' working together to make the /f/ sound.",
                "workedExplanation": "In 'phantom', the consonant digraph 'ph' represents the /f/ sound."
            },
            {
                "id": "q-fs-u1-2",
                "type": "sequencing",
                "foundationalActivityType": "Build Word",
                "difficulty": 1,
                "teks": "3.2A.iv",
                "prompt": "Build the 3-syllable word 'fantastic' by ordering its closed syllables from first to last.",
                "sequenceItems": ["fan", "tas", "tic"],
                "correctAnswer": "fan|tas|tic",
                "hint": "Sound out each closed syllable in order: /fan/ - /tas/ - /tic/.",
                "workedExplanation": "Dividing between the consonants (VC/CV) gives fan-tas-tic."
            },
            {
                "id": "q-fs-u1-3",
                "type": "fill_blank",
                "foundationalActivityType": "Listening Activities",
                "difficulty": 2,
                "teks": "3.2B.i",
                "prompt": "Spell the word that means a structure built over a river: br + i + dge = ______ (Hint: uses trigraph dge after short i)",
                "correctAnswer": "bridge",
                "acceptableAnswers": ["bridge"],
                "hint": "Combine br + i + dge.",
                "workedExplanation": "After a single short vowel 'i', the /j/ sound is spelled with the trigraph 'dge': bridge.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-fs-u2",
        "title": "Lesson 1: Open Syllables (V/CV Pattern) & Inflectional Suffixes (–ed, –ing)",
        "teks": ["3.2A.ii", "3.2A.iv", "3.2B.i", "3.2B.vii"],
        "objective": "Decode and spell multisyllabic words with open syllables (V/CV) and suffixes -ed and -ing.",
        "phonicsFocus": "Open Syllables (V/CV: ti/ger, pi/lot, ba/con, mu/sic) & Suffixes -ed, -ing",
        "fluencyPassage": "From A Talk with Animals (Unit 2 Reader): The curious leopard was hiding quietly in the leafy tree branches, watching the group of zebras walking toward the river.",
        "wordBuilding": [
            {"targetWord": "tiger", "syllables": ["ti", "ger"], "hint": "In V/CV division, the first syllable 'ti' is open, so the 'i' says its long name!"},
            {"targetWord": "pilot", "syllables": ["pi", "lot"], "hint": "Open first syllable 'pi' + closed second syllable 'lot'."}
        ],
        "soundMatches": [
            {"soundPrompt": "Which word starts with an OPEN syllable (V/CV) where the first vowel is long?", "phoneme": "Long vowel open syllable (V/CV)", "correctWord": "robot", "distractors": ["rabbit", "napkin", "picnic"]}
        ],
        "questions": [
            {
                "id": "q-fs-u2-1",
                "type": "multiple_choice",
                "foundationalActivityType": "Match Sound",
                "difficulty": 1,
                "teks": "3.2A.iv",
                "prompt": "How is the word 'pilot' divided into syllables using the V/CV open syllable pattern from Foundational Skills Unit 2?",
                "options": ["pi / lot", "pil / ot", "p / ilot", "pilo / t"],
                "correctAnswer": "pi / lot",
                "hint": "In the V/CV pattern, divide right after the first long vowel!",
                "workedExplanation": "'pi/lot' has an open first syllable (pi) with a long 'i' sound, followed by the closed syllable (lot).",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-fs-u3",
        "title": "Lesson 1: VCe Split Digraphs (a_e, i_e, o_e, u_e) & Dropping Final Silent 'e'",
        "teks": ["3.2A.ii", "3.2A.vi", "3.2B.i", "3.2B.vii"],
        "objective": "Read and spell multisyllabic VCe words and apply the Drop-the-Final-e rule when adding vowel suffixes.",
        "phonicsFocus": "Split Digraphs (a_e, i_e, o_e, u_e) & Suffix Spelling (Drop final e before vowel suffix)",
        "fluencyPassage": "From Healthy Humans: How to Keep Your Body Strong (Unit 3 Reader): Exercising outside and drinking clean water every day helps your muscles and bones grow stronger while you play!",
        "wordBuilding": [
            {"targetWord": "making", "syllables": ["mak", "ing"], "hint": "Drop the silent 'e' in 'make' before adding the vowel suffix '-ing'!"},
            {"targetWord": "hopeful", "syllables": ["hope", "ful"], "hint": "Keep the silent 'e' in 'hope' when adding a consonant suffix like '-ful'!"}
        ],
        "soundMatches": [
            {"soundPrompt": "Which word correctly drops the final silent 'e' when adding the vowel suffix '-ing'?", "phoneme": "VCe + -ing", "correctWord": "smiling", "distractors": ["smileing", "smilling", "smilng"]}
        ],
        "questions": [
            {
                "id": "q-fs-u3-1",
                "type": "fill_blank",
                "foundationalActivityType": "Build Word",
                "difficulty": 2,
                "teks": "3.2B.vii",
                "prompt": "Apply the Unit 3 suffix rule to spell the new word: compete + ing = _________",
                "correctAnswer": "competing",
                "acceptableAnswers": ["competing"],
                "hint": "Since '-ing' starts with a vowel, drop the final silent 'e' in 'compete' before adding '-ing'.",
                "workedExplanation": "When adding a vowel suffix (-ing) to a VCe word (compete), drop the final 'e': competing.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-fs-u4",
        "title": "Lesson 1: Vowel Teams (ee, ea, ai, ay, ue), Prefixes (un–, dis–, mis–, re–, pre–) & Homophones",
        "teks": ["3.2A.ii", "3.2A.v", "3.2A.vi", "3.2B.ii", "3.3C", "3.3D"],
        "objective": "Decode vowel teams, determine how prefixes change base word meanings, and spell homophones accurately.",
        "phonicsFocus": "Vowel Teams (ee, ea, ai, ay, ue), Prefixes (un-, dis-, mis-, re-, pre-), Suffixes (-ist, -ian, -al) & Homophones",
        "fluencyPassage": "From Frankie Figures It Out (Unit 4 Reader): Frankie and her mom spent the day as Rules Detectives at the swimming pool and the public library, realizing that rules keep everyone safe!",
        "wordBuilding": [
            {"targetWord": "preheat", "syllables": ["pre", "heat"], "hint": "Prefix 'pre-' (before) + base word 'heat' (with vowel team ea)."},
            {"targetWord": "musician", "syllables": ["mu", "si", "cian"], "hint": "Base word 'music' + suffix '-ian' (a person who performs music)."}
        ],
        "soundMatches": [
            {"soundPrompt": "Which word uses the prefix 're-' meaning 'to do again'?", "phoneme": "Prefix re-", "correctWord": "rebuild", "distractors": ["unhappy", "misplace", "preview"]}
        ],
        "questions": [
            {
                "id": "q-fs-u4-1",
                "type": "multiple_choice",
                "foundationalActivityType": "Match Sound",
                "difficulty": 1,
                "teks": "3.3C",
                "prompt": "In Foundational Skills Unit 4, the prefix 'mis–' is added to the word 'understand' to make 'misunderstand'. What does 'misunderstand' mean?",
                "options": [
                    "To understand wrongly or incorrectly",
                    "To understand before anyone else",
                    "To understand again and again",
                    "A person who studies understanding"
                ],
                "correctAnswer": "To understand wrongly or incorrectly",
                "hint": "Remember that the prefix 'mis-' means 'wrongly' or 'badly' (as in misspell or misplace).",
                "workedExplanation": "The prefix 'mis-' means 'wrongly', so 'misunderstand' means to understand wrongly.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-fs-u5",
        "title": "Lesson 1: R-Controlled Syllables (er, ir, ur, ar, or) & Suffixes (–y, –ous, –ly, –ive, –en)",
        "teks": ["3.2A.ii", "3.2A.iv", "3.2B.i", "3.3C"],
        "objective": "Decode and spell r-controlled multisyllabic words and apply derivational suffixes -ous, -ly, and -ive.",
        "phonicsFocus": "R-Controlled Vowels (er, ir, ur, ar, or) & Suffixes (-y, -ous, -ly, -ive, -en)",
        "fluencyPassage": "From Adventures of Marcus and Cory (Unit 5 Reader): Marcus and Cory heard the cheerful music of the carnival carousel and saw bright lanterns glowing in the warm evening air.",
        "wordBuilding": [
            {"targetWord": "carpenter", "syllables": ["car", "pen", "ter"], "hint": "Starts with 'car' (ar) and ends with 'ter' (er)."},
            {"targetWord": "courageous", "syllables": ["cou", "ra", "geous"], "hint": "Full of courage (suffix -ous)."}
        ],
        "soundMatches": [
            {"soundPrompt": "Which multisyllabic word contains two r-controlled syllables ('ar' and 'er')?", "phoneme": "ar and er", "correctWord": "harvester", "distractors": ["kettle", "holiday", "bubble"]}
        ],
        "questions": [
            {
                "id": "q-fs-u5-1",
                "type": "multiple_choice",
                "foundationalActivityType": "Build Word",
                "difficulty": 1,
                "teks": "3.3C",
                "prompt": "What does the suffix '–ous' mean when added to a noun like 'danger' to form the adjective 'dangerous'?",
                "options": ["Full of (full of danger)", "Without (without danger)", "Before (before danger)", "Able to be"],
                "correctAnswer": "Full of (full of danger)",
                "hint": "Think of words like 'joyous', 'famous', and 'courageous'!",
                "workedExplanation": "The suffix '-ous' means 'full of' or 'having the quality of', so 'dangerous' means full of danger.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-fs-u6",
        "title": "Lesson 1: Contractions, Final Stable Syllables (–ble, –dle, –gle, –tle) & Suffix Spelling Rules",
        "teks": ["3.2A.iii", "3.2A.vi", "3.2B.iii", "3.2B.vii"],
        "objective": "Decode final stable Consonant + le syllables, form contractions, and apply the Double-the-Consonant and Change-y-to-i rules.",
        "phonicsFocus": "Final Stable Syllables (-ble, -dle, -gle, -ple, -cle, -ckle) & Change y to i / Double Final Consonant",
        "fluencyPassage": "From To the Stars: Lily Explores Space (Unit 6 Reader): Lily looked through her telescope at the twinkling stars and purple nebula, wondering how astronauts travel together through space!",
        "wordBuilding": [
            {"targetWord": "sparkle", "syllables": ["spar", "kle"], "hint": "R-controlled syllable 'spar' + final stable syllable 'kle'."},
            {"targetWord": "happiest", "syllables": ["hap", "pi", "est"], "hint": "Change the 'y' in 'happy' to 'i' before adding '-est'!"}
        ],
        "soundMatches": [
            {"soundPrompt": "Which word correctly changes 'y' to 'i' before adding the suffix '-es'?", "phoneme": "Change y to i", "correctWord": "families", "distractors": ["familyes", "familes", "familiys"]}
        ],
        "questions": [
            {
                "id": "q-fs-u6-1",
                "type": "multiple_choice",
                "foundationalActivityType": "Build Word",
                "difficulty": 2,
                "teks": "3.2A.ii",
                "prompt": "How is the word 'tumble' divided into syllables using the Final Stable Syllable (Consonant + le) rule in Unit 6?",
                "options": ["tum / ble", "tumb / le", "tu / mble", "t / umble"],
                "correctAnswer": "tum / ble",
                "hint": "In a Consonant + le word, the consonantright before '-le' stays with '-le' in the final syllable!",
                "workedExplanation": "The final stable syllable '-ble' stays together, dividing the word as tum/ble.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-fs-u7",
        "title": "Lesson 1: Diphthongs (/aw/ aw, au; /ou/ ow, ou; /oi/ oy, oi), Homographs & Suffixes –able/–ible",
        "teks": ["3.2A.ii", "3.2B.i", "3.3C", "3.3D"],
        "objective": "Decode and spell vowel diphthongs (aw, au, ow, ou, oy, oi), distinguish homographs, and apply suffixes -able and -ible.",
        "phonicsFocus": "Diphthongs (aw, au, ow, ou, oy, oi), Homographs & Suffixes (-able, -ible)",
        "fluencyPassage": "From Everyday Heroes (Unit 7 Reader): Firefighters and paramedics work with great courage and patience, ready to launch into action whenever an accidental emergency happens in town.",
        "wordBuilding": [
            {"targetWord": "astronaut", "syllables": ["as", "tro", "naut"], "hint": "Contains the /aw/ diphthong spelled 'au' in the last syllable."},
            {"targetWord": "enjoyable", "syllables": ["en", "joy", "a", "ble"], "hint": "Contains the /oi/ diphthong spelled 'oy' plus suffix '-able'."}
        ],
        "soundMatches": [
            {"soundPrompt": "Which word contains the /oi/ diphthong spelled 'oi'?", "phoneme": "/oi/ spelled oi", "correctWord": "moisture", "distractors": ["mountain", "applause", "awesome"]}
        ],
        "questions": [
            {
                "id": "q-fs-u7-1",
                "type": "multiple_choice",
                "foundationalActivityType": "Match Sound",
                "difficulty": 2,
                "teks": "3.3D",
                "prompt": "In the two sentences: (1) 'The archer used a wooden bow.' and (2) 'The actors took a bow after the play.' What are the two words spelled 'bow' called?",
                "options": [
                    "Homographs (words spelled the same with different meanings/pronunciations)",
                    "Contractions",
                    "Abbreviations",
                    "Numbers"
                ],
                "correctAnswer": "Homographs (words spelled the same with different meanings/pronunciations)",
                "hint": "'Homo-' means same, and '-graph' means written/spelled!",
                "workedExplanation": "Homographs are words that share the exact same spelling ('bow') but have different meanings and sometimes different pronunciations.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-fs-u8",
        "title": "Lesson 1: Vowel Teams (oo, ew, ue, ui), Abbreviations & Prefixes (anti–, in–, pro–)",
        "teks": ["3.2A.ii", "3.2A.iii", "3.2B.ii", "3.2B.iii", "3.3C"],
        "objective": "Decode /oo/ vowel teams (oo, ew, ue, ui), use standard abbreviations, and explain prefixes anti-, in-, and pro-.",
        "phonicsFocus": "Vowel Teams (oo, ew, ue, ui), Abbreviations (Dr., Mr., Mrs., St., Ave.) & Prefixes (anti-, in-, pro-)",
        "fluencyPassage": "From The Other Side of the World (Unit 8 Reader): Dr. Evans traveled to a wildlife sanctuary in Australia to study kangaroos, koalas, and little blue penguins by the sea!",
        "wordBuilding": [
            {"targetWord": "kangaroo", "syllables": ["kan", "ga", "roo"], "hint": "Ends with the /oo/ vowel team 'oo'."},
            {"targetWord": "suitcases", "syllables": ["suit", "ca", "ses"], "hint": "Starts with the /oo/ vowel team 'ui' in 'suit'."}
        ],
        "soundMatches": [
            {"soundPrompt": "Which word has the /oo/ sound (as in 'moon') spelled with the vowel team 'ew'?", "phoneme": "/oo/ spelled ew", "correctWord": "nephew", "distractors": ["wooden", "cookbook", "brook"]}
        ],
        "questions": [
            {
                "id": "q-fs-u8-1",
                "type": "matching",
                "foundationalActivityType": "Build Word",
                "difficulty": 1,
                "teks": "3.2A.iii",
                "prompt": "Match each full word from Foundational Skills Unit 8 Lesson 10 to its correct abbreviation.",
                "matchingPairs": [
                    {"left": "Doctor", "right": "Dr."},
                    {"left": "Avenue", "right": "Ave."},
                    {"left": "Street", "right": "St."},
                    {"left": "Mister", "right": "Mr."}
                ],
                "correctAnswer": "Doctor:Dr.|Avenue:Ave.|Street:St.|Mister:Mr.",
                "hint": "Remember that standard abbreviations begin with a capital letter and end with a period.",
                "workedExplanation": "Doctor = Dr., Avenue = Ave., Street = St., and Mister = Mr.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-fs-u9",
        "title": "Lesson 1: Synonyms, Antonyms, Affixes (im–, non–, –ful) & Soft c and Soft g Words",
        "teks": ["3.2A.i", "3.2B.iv", "3.3B", "3.3C"],
        "objective": "Identify synonyms and antonyms, decode multisyllabic words with soft 'c' (/s/) and soft 'g' (/j/), and apply affixes im- and non-.",
        "phonicsFocus": "Synonyms & Antonyms, Prefixes (im-, non-), Suffix (-ful) & Soft c (ce, ci, cy) / Soft g (ge, gi, gy)",
        "fluencyPassage": "From George Meets Mr. Henry (Unit 9 Reader): In Williamsburg, Virginia, young George listened politely as Patrick Henry spoke with giant energy and courage to the citizens!",
        "wordBuilding": [
            {"targetWord": "citizen", "syllables": ["cit", "i", "zen"], "hint": "Starts with soft 'c' followed by 'i', making the /s/ sound!"},
            {"targetWord": "impossible", "syllables": ["im", "pos", "si", "ble"], "hint": "Prefix 'im-' (not) + 'possible'."}
        ],
        "soundMatches": [
            {"soundPrompt": "Which word starts with a SOFT 'g' (/j/ sound) because 'g' is followed by 'e', 'i', or 'y'?", "phoneme": "Soft g (/j/)", "correctWord": "generous", "distractors": ["garden", "gallon", "golden"]}
        ],
        "questions": [
            {
                "id": "q-fs-u9-1",
                "type": "multiple_choice",
                "foundationalActivityType": "Match Sound",
                "difficulty": 1,
                "teks": "3.2A.i",
                "prompt": "In Foundational Skills Unit 9 Lesson 9, why does the letter 'c' make the /s/ sound in the words 'celebrate', 'citizen', and 'bicycle'?",
                "options": [
                    "Because 'c' is followed by the letters e, i, or y (the Soft 'c' rule)",
                    "Because 'c' is at the very end of the word",
                    "Because 'c' is followed by o, u, or a",
                    "Because the 'c' is silent"
                ],
                "correctAnswer": "Because 'c' is followed by the letters e, i, or y (the Soft 'c' rule)",
                "hint": "Look at the vowel immediately following 'c' in ce-lebrate, ci-tizen, and bi-cy-cle!",
                "workedExplanation": "When 'c' is followed by e, i, or y, it makes its soft /s/ sound.",
                "isMiniAssessment": True
            }
        ]
    },
    {
        "unitId": "unit-fs-u10",
        "title": "Lesson 1: Spelling Patterns (eigh, ough), Compound Words & Figurative Idioms",
        "teks": ["3.2A.i", "3.2A.ii", "3.2B.i", "3.2B.iv", "3.3D"],
        "objective": "Decode and spell words with 'eigh' and 'ough', form compound words, and explain the figurative meaning of idioms.",
        "phonicsFocus": "Spelling Patterns eigh (/ay/) and ough, Compound Words, Affixes & Figurative Idioms",
        "fluencyPassage": "From Unit 10 Reader: The eight neighborhood musicians practiced their song thoroughly at school. Before they walked onto the stage, their teacher smiled and said, 'Break a leg!'",
        "wordBuilding": [
            {"targetWord": "neighbor", "syllables": ["neigh", "bor"], "hint": "Uses the 4-letter spelling pattern 'eigh' to make the long /ay/ sound."},
            {"targetWord": "thunderstorm", "syllables": ["thun", "der", "storm"], "hint": "Compound word joining 'thunder' + 'storm'."}
        ],
        "soundMatches": [
            {"soundPrompt": "Which word uses the 4-letter pattern 'eigh' to make the long /ay/ sound?", "phoneme": "/ay/ spelled eigh", "correctWord": "eighteen", "distractors": ["enough", "through", "thought"]}
        ],
        "questions": [
            {
                "id": "q-fs-u10-1",
                "type": "multiple_choice",
                "foundationalActivityType": "Listening Activities",
                "difficulty": 1,
                "teks": "3.3D",
                "prompt": "In Foundational Skills Unit 10 Lesson 12, a student says, 'That spelling test was a piece of cake!' What does the idiom 'a piece of cake' mean?",
                "options": [
                    "Something that was very easy to do",
                    "A test written with frosting on a birthday cake",
                    "Something that was impossible to finish",
                    "A recipe for baking"
                ],
                "correctAnswer": "Something that was very easy to do",
                "hint": "An idiom has a figurative meaning different from the literal words.",
                "workedExplanation": "The idiom 'a piece of cake' means that a task was very easy to accomplish.",
                "isMiniAssessment": True
            }
        ]
    }
]

for bp in fs_blueprints:
    l_id = f"lesson-{bp['unitId']}-l1"
    s_id = f"skill-{bp['unitId']}-1"
    u_num = int(bp["unitId"].split("-u")[1])
    u_obj = next(u for u in units if u["id"] == bp["unitId"])
    we = {
        "id": f"we-{bp['unitId']}",
        "title": f"Word Chunking & Phonics Strategy ({bp['phonicsFocus']})",
        "problem": bp["questions"][0]["prompt"],
        "steps": [
            f"Step 1 (Identify Phonics Pattern): Focus on {bp['phonicsFocus']}.",
            "Step 2 (Chunk Syllables): Locate vowels and divide syllables using Bluebonnet syllable division rules.",
            "Step 3 (Blend & Decode): Sound out each syllable and blend them smoothly.",
            "Step 4 (Check in Context): Read the word inside the sentence to confirm its meaning."
        ],
        "solution": bp["questions"][0]["correctAnswer"],
        "visualModelType": "word_chunking"
    }
    l_doc = {
        "id": l_id,
        "unitId": bp["unitId"],
        "subjectId": "subj-fs",
        "lessonNumber": 1,
        "topicCode": f"FS Unit {u_num}",
        "title": bp["title"],
        "teks": bp["teks"],
        "objective": bp["objective"],
        "vocabulary": u_obj["vocabulary"],
        "sections": {
            "introduction": f"Welcome to {bp['title']}! In this Foundational Skills lesson, you will practice Sight Words, Tricky Words, Phonics Sound Matching, Syllable Word Building, and Read-Aloud Fluency.",
            "learningObjective": bp["objective"],
            "examples": [we],
            "guidedPractice": [
                {
                    "prompt": f"Guided Phonics & Syllable Check ({bp['phonicsFocus']})",
                    "scaffoldSteps": we["steps"],
                    "checkQuestion": bp["questions"][0]["prompt"],
                    "checkAnswer": bp["questions"][0]["correctAnswer"]
                }
            ],
            "independentPractice": [
                "Use the Interactive Phonics & Word Building Lab in this lesson to practice Sight Words, Sound Matching, Syllable Building, and Read-Aloud Fluency Tracking.",
                "Then complete the Skill Practice questions to earn XP, Coins, and SmartScore mastery!"
            ],
            "assessment": f"Foundational Skills Decoding, Spelling & Fluency Assessment ({', '.join(bp['teks'])}).",
            "summary": f"Awesome work on {bp['title']}! You practiced {bp['phonicsFocus']} and read from {u_obj.get('readerTitle', 'the Unit Reader')}."
        },
        "foundationalExtras": {
            "sightWords": u_obj.get("highFrequencyWords", []),
            "trickyWords": u_obj.get("trickyWords", []),
            "phonicsFocus": bp["phonicsFocus"],
            "fluencyPassage": bp["fluencyPassage"],
            "wordBuildingTiles": bp["wordBuilding"],
            "soundMatches": bp["soundMatches"]
        },
        "skillIds": [s_id],
        "estimatedMinutes": 20,
        "sourcePdf": u_obj["sourcePdf"],
        "order": 1
    }
    sk_doc = {
        "id": s_id,
        "lessonId": l_id,
        "unitId": bp["unitId"],
        "subjectId": "subj-fs",
        "code": f"FS.{u_num}.1",
        "title": bp["title"].split(": ", 1)[1],
        "description": bp["objective"],
        "teks": bp["teks"][0],
        "difficulty": 1 if u_num <= 4 else 2,
        "easierSkillId": "skill-unit-fs-u1-1" if u_num > 1 else None,
        "workedExample": we,
        "hints": [q["hint"] for q in bp["questions"]],
        "miniAssessmentSummary": f"Foundational Skills Unit {u_num} Decoding & Spelling Check",
        "questionIds": [],
        "order": 1
    }
    q_docs = []
    for q in bp["questions"]:
        q_copy = dict(q)
        q_copy["skillId"] = s_id
        q_copy["lessonId"] = l_id
        q_copy["unitId"] = bp["unitId"]
        q_copy["subjectId"] = "subj-fs"
        q_copy["audioInstruction"] = q["prompt"]
        q_docs.append(q_copy)
    add_bundle(l_doc, [(sk_doc, q_docs)])

# Update subject totals accurately
for subj in subjects:
    s_units = [u for u in units if u["subjectId"] == subj["id"]]
    s_lessons = [l for l in lessons if l["subjectId"] == subj["id"]]
    s_skills = [sk for sk in skills if sk["subjectId"] == subj["id"]]
    subj["totalUnits"] = len(s_units)
    subj["totalLessons"] = len(s_lessons)
    subj["totalSkills"] = len(s_skills)

dataset = {
    "metadata": {
        "curriculumName": "Texas Bluebonnet Learning Grade 3 Curriculum (2026–2027)",
        "sourceExcel": "3rd_Grade_Curriculum.xlsx",
        "sourceFolders": [
            "downloads/Bluebonnet Learning Grade 3 Math",
            "downloads/Bluebonnet Learning Grade 3 Reading Language Arts",
            "downloads/Bluebonnet Learning Grade 3 Foundational Skills"
        ],
        "generatedAt": "2026-11-01T01:00:00Z",
        "excelCalendarWeeks": excel_weeks
    },
    "subjects": subjects,
    "units": units,
    "lessons": lessons,
    "skills": skills,
    "questions": questions,
    "badges": badges
}

out_dir = r"c:\Projects\apps\BBLearningApp\src\data"
os.makedirs(out_dir, exist_ok=True)
out_file = os.path.join(out_dir, "bluebonnet-curriculum.json")
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(dataset, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {out_file}:")
print(f"  Subjects:  {len(subjects)}")
print(f"  Units:     {len(units)}")
print(f"  Lessons:   {len(lessons)}")
print(f"  Skills:    {len(skills)}")
print(f"  Questions: {len(questions)}")
print(f"  Badges:    {len(badges)}")

