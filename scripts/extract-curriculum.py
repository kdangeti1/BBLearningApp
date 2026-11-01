import json
import os
import openpyxl

# Verify Excel source of truth exists
excel_path = r"c:\Projects\apps\BBLearningApp\3rd_Grade_Curriculum.xlsx"
wb = openpyxl.load_workbook(excel_path)
ws = wb["3rd"]

# Extract week headers from Row 3 & Row 4 of 3rd_Grade_Curriculum.xlsx
excel_weeks = []
for col in range(3, ws.max_column + 1, 2):
    w_val = ws.cell(3, col).value
    d_val = ws.cell(4, col).value
    if w_val or d_val:
        excel_weeks.append({
            "col": col,
            "week": str(w_val).strip() if w_val else "",
            "days": str(d_val).replace("\n", "") if d_val else ""
        })

subjects = [
    {
        "id": "subj-math",
        "title": "Mathematics",
        "slug": "mathematics",
        "description": "Bluebonnet Learning Grade 3 K–5 Math: Multiplication & Division, Place Value & Measurement, Area, Fractions on the Number Line, Financial Literacy & Data, and Geometry & Perimeter.",
        "icon": "Calculator",
        "colorTheme": "blue",
        "totalUnits": 7,
        "totalLessons": 21,
        "totalSkills": 28,
        "teksOverview": [
            "3.2A", "3.2B", "3.2C", "3.2D",
            "3.3A", "3.3B", "3.3C", "3.3D", "3.3E", "3.3F", "3.3G", "3.3H",
            "3.4A", "3.4B", "3.4C", "3.4D", "3.4E", "3.4F", "3.4G", "3.4H", "3.4I", "3.4J", "3.4K",
            "3.5A", "3.5B", "3.5C", "3.5D", "3.5E",
            "3.6A", "3.6B", "3.6C", "3.6D", "3.6E",
            "3.7A", "3.7B", "3.7C", "3.7D", "3.7E",
            "3.8A", "3.8B",
            "3.9A", "3.9B", "3.9C", "3.9D", "3.9E", "3.9F"
        ],
        "sourcePdfFolder": "downloads/Bluebonnet Learning Grade 3 Math",
        "order": 1
    },
    {
        "id": "subj-rla",
        "title": "Reading Language Arts",
        "slug": "reading-language-arts",
        "description": "Bluebonnet Learning Grade 3 Reading Language Arts: Classic Tales (The Wind in the Willows), Animal Classification, Human Body, Ancient Rome, Light & Sound, Astronomy, Native Americans, Early Explorations, Colonial America, and All That Jazz.",
        "icon": "BookOpen",
        "colorTheme": "emerald",
        "totalUnits": 10,
        "totalLessons": 20,
        "totalSkills": 24,
        "teksOverview": [
            "3.1A", "3.1C", "3.1D", "3.2A", "3.2B", "3.2D",
            "3.3A", "3.3B", "3.3C", "3.3D", "3.4",
            "3.6A", "3.6B", "3.6C", "3.6E", "3.6F", "3.6G", "3.6H",
            "3.7B", "3.7C", "3.7D", "3.7E", "3.7F", "3.7G",
            "3.8A", "3.8B", "3.8C", "3.8D",
            "3.9A", "3.9B", "3.9D", "3.10A", "3.10B", "3.10C", "3.10D",
            "3.11A", "3.11B", "3.11C", "3.11D", "3.12A", "3.12B", "3.12C", "3.13A-H"
        ],
        "sourcePdfFolder": "downloads/Bluebonnet Learning Grade 3 Reading Language Arts",
        "order": 2
    },
    {
        "id": "subj-fs",
        "title": "Foundational Skills",
        "slug": "foundational-skills",
        "description": "Bluebonnet Learning Grade 3 Foundational Skills: Digraphs & Trigraphs, Syllable Division (VC/CV, V/CV, VCCCV), VCe Split Digraphs, Vowel Teams, R-Controlled Vowels, Final Stable Syllables, Diphthongs, Homophones/Homographs, Affixes, and Fluency.",
        "icon": "Sparkles",
        "colorTheme": "amber",
        "totalUnits": 10,
        "totalLessons": 20,
        "totalSkills": 22,
        "teksOverview": [
            "3.1A", "3.1B", "3.1C", "3.1D", "3.1E",
            "3.2A.i", "3.2A.ii", "3.2A.iii", "3.2A.iv", "3.2A.v", "3.2A.vi", "3.2A.vii",
            "3.2B.i", "3.2B.ii", "3.2B.iii", "3.2B.iv", "3.2B.v", "3.2B.vi", "3.2B.vii",
            "3.2C", "3.2D", "3.3A", "3.3B", "3.3C", "3.3D", "3.4", "3.5"
        ],
        "sourcePdfFolder": "downloads/Bluebonnet Learning Grade 3 Foundational Skills",
        "order": 3
    }
]

units = [
    # ================= MATHEMATICS (7 MODULES) =================
    {
        "id": "unit-math-m1",
        "subjectId": "subj-math",
        "subjectTitle": "Mathematics",
        "unitNumber": 1,
        "code": "M1",
        "title": "Module 1: Properties of Multiplication and Division and Solving Problems with Units of 2–5 and 10",
        "subtitle": "Equal Groups, Arrays, Unknown Factors, Commutative & Distributive Properties",
        "nineWeeks": "1st Nine Weeks",
        "weekRange": "1st Nine Weeks • Weeks 2–5 (08/24–09/18)",
        "instructionalDays": 22,
        "teksStandards": ["3.4D", "3.4E", "3.4F", "3.4H", "3.4J", "3.4K", "3.5A", "3.5B", "3.5D"],
        "elpsStandards": ["1.A", "1.E", "1.F", "2.C", "2.E", "2.I", "3.B", "3.E", "4.D", "4.G", "5.B"],
        "overview": "This 22-day module builds on fluency with addition and arrays to develop conceptual understanding of multiplication and division with units of 2–5 and 10, exploring equal groups, arrays, strip diagrams, and the commutative and distributive properties.",
        "learningObjectives": [
            "Understand equal groups of objects as multiplication and write multiplication equations using arrays.",
            "Understand division as an unknown factor problem (size of group or number of groups).",
            "Demonstrate the commutativity of multiplication and model the distributive property to decompose units.",
            "Solve one- and two-step word problems involving multiplication and division within 100 using Read-Draw-Write (RDW)."
        ],
        "vocabulary": [
            {"term": "Array", "definition": "A rectangular arrangement of equal groups organized in rows and columns.", "exampleSentence": "A 3 by 5 array has 3 rows with 5 tiles in each row.", "spanishCognate": "Arreglo"},
            {"term": "Commutative Property", "definition": "Changing the order of the factors in a multiplication equation does not change its product.", "exampleSentence": "By the commutative property, 3 × 5 = 5 × 3 = 15.", "spanishCognate": "Propiedad conmutativa"},
            {"term": "Distribute", "definition": "To multiply each part of a decomposed factor by the other factor.", "exampleSentence": "We can distribute 7 × 4 as (5 × 4) + (2 × 4).", "spanishCognate": "Distribuir"},
            {"term": "Factors", "definition": "The numbers multiplied together in a multiplication expression or equation.", "exampleSentence": "In 4 × 3 = 12, the numbers 4 and 3 are the factors.", "spanishCognate": "Factores"},
            {"term": "Product", "definition": "The total when multiplying two or more numbers together.", "exampleSentence": "The product of 4 and 5 is 20.", "spanishCognate": "Producto"},
            {"term": "Quotient", "definition": "The number resulting from the division of two numbers.", "exampleSentence": "In 18 ÷ 3 = 6, the quotient is 6.", "spanishCognate": "Cociente"},
            {"term": "Strip Diagram", "definition": "A rectangular model that looks like a segment of tape used to show number relationships.", "exampleSentence": "Draw a strip diagram with 4 equal units to solve the division word problem.", "spanishCognate": "Diagrama de tiras"}
        ],
        "assessments": ["Mid-Module 1 Assessment Task (Topics A–C)", "End-of-Module 1 Assessment Task (Topics A–F)"],
        "sourcePdf": "BLMATH-G3-M1-Teacher-ENG.pdf / BLMATH-G3-M1-Learn-ENG.pdf",
        "order": 1
    },
    {
        "id": "unit-math-m2",
        "subjectId": "subj-math",
        "subjectTitle": "Mathematics",
        "unitNumber": 2,
        "code": "M2",
        "title": "Module 2: Place Value and Problem Solving with Units of Measure",
        "subtitle": "Time Intervals, Weight, Liquid Volume, Place Value to 100,000, Rounding & Standard Algorithm",
        "nineWeeks": "1st Nine Weeks",
        "weekRange": "1st & 2nd Nine Weeks • Weeks 6–12 (09/22–11/06)",
        "instructionalDays": 31,
        "teksStandards": ["3.2A", "3.2B", "3.2C", "3.2D", "3.4A", "3.4B", "3.5A", "3.7C", "3.7D", "3.7E"],
        "elpsStandards": ["1.A", "1.D", "1.E", "2.C", "2.E", "2.I", "3.C", "3.E", "4.D", "4.G", "5.B"],
        "overview": "Students explore measurements of time intervals in minutes, weight in ounces and pounds, liquid volume in liters, milliliters, and customary units, extend place value understanding up to 100,000, round numbers on a vertical number line, and add/subtract within 1,000 using the standard algorithm.",
        "learningObjectives": [
            "Solve problems involving addition and subtraction of time intervals in minutes on a number line and clock.",
            "Determine weight (oz, lb) and liquid volume (mL, L, cups, pints, quarts, gallons) using appropriate units and tools.",
            "Compose, decompose, read, write, compare (<, >, =), and order numbers up to 100,000 including expanded notation.",
            "Round whole numbers on a vertical number line and fluently add and subtract within 1,000 using the standard algorithm."
        ],
        "vocabulary": [
            {"term": "Expanded Notation", "definition": "An equation that is a sum of multiplication expressions, each representing the value of one digit as the product of that digit and a place value unit.", "exampleSentence": "In expanded notation, 43,215 = (4 × 10,000) + (3 × 1,000) + (2 × 100) + (1 × 10) + (5 × 1).", "spanishCognate": "Notación expandida"},
            {"term": "Interval", "definition": "The distance or time elapsed between two points on a number line.", "exampleSentence": "The time interval from 2:15 p.m. to 2:45 p.m. is 30 minutes.", "spanishCognate": "Intervalo"},
            {"term": "Liquid Volume", "definition": "A measurement of the amount of space that liquid takes up in a container.", "exampleSentence": "We measured the liquid volume of water in the beaker in milliliters.", "spanishCognate": "Volumen líquido"},
            {"term": "Compatible Numbers", "definition": "Numbers that make mental calculations more efficient when estimating solutions.", "exampleSentence": "To estimate 28 + 37, we can use compatible numbers or round to 30 + 40 = 70.", "spanishCognate": "Números compatibles"},
            {"term": "Standard Algorithm", "definition": "A systematic process for adding or subtracting numbers one place value unit at a time.", "exampleSentence": "Use the standard algorithm to regroup 10 ones as 1 ten.", "spanishCognate": "Algoritmo estándar"}
        ],
        "assessments": ["Mid-Module 2 Assessment Task (Topics A–C)", "End-of-Module 2 Assessment Task (Topics A–F)"],
        "sourcePdf": "BLMATH-G3-M2-Teacher-ENG.pdf / BLMATH-G3-M2-Learn-ENG.pdf",
        "order": 2
    },
    {
        "id": "unit-math-m3",
        "subjectId": "subj-math",
        "subjectTitle": "Mathematics",
        "unitNumber": 3,
        "code": "M3",
        "title": "Module 3: Multiplication and Division with Units of 0, 1, 6–9, and Multiples of 10",
        "subtitle": "Multiplicative Comparison, Input-Output Tables, Associative Property & Two-Digit by One-Digit Multiplication",
        "nineWeeks": "2nd Nine Weeks",
        "weekRange": "2nd Nine Weeks • Weeks 13–16 (11/10–12/11)",
        "instructionalDays": 26,
        "teksStandards": ["3.2B", "3.4D", "3.4E", "3.4F", "3.4G", "3.4H", "3.4I", "3.4K", "3.5A", "3.5B", "3.5C", "3.5D", "3.5E"],
        "overview": "Students explore multiplicative comparison, input-output tables, multiplication and division with units of 0, 1, 6, 7, 8, and 9, even/odd divisibility by 2, multiplying by multiples of 10, and multiplying two-digit numbers by one-digit numbers using area models and the standard algorithm.",
        "learningObjectives": [
            "Describe multiplication as a comparison (e.g., 3 × 24 represents 3 times as much as 24) and represent number pairs in input-output tables.",
            "Recall and apply multiplication and division facts for 0, 1, 6, 7, 8, and 9 using distributive and associative properties.",
            "Determine if a number is even or odd using the divisibility rule for 2.",
            "Multiply a two-digit number by a one-digit number using place value disks, area models, partial products, and the standard algorithm."
        ],
        "vocabulary": [
            {"term": "Area Model", "definition": "A model for multiplication problems that relates a rectangular array to the area of a rectangle.", "exampleSentence": "We decomposed 24 × 3 into (20 × 3) + (4 × 3) using an area model.", "spanishCognate": "Modelo de área"},
            {"term": "Input–Output Table", "definition": "A table with inputs in the first column/row and corresponding outputs following a rule in the second column/row.", "exampleSentence": "In the input-output table, each input is multiplied by 6 to get the output.", "spanishCognate": "Tabla de entrada y salida"},
            {"term": "Multiple", "definition": "The product of a given number and another whole number found when skip-counting.", "exampleSentence": "The numbers 6, 12, 18, and 24 are multiples of 6.", "spanishCognate": "Múltiplo"},
            {"term": "Partial Product", "definition": "One of the products resulting from decomposing one factor and multiplying each part by the other factor.", "exampleSentence": "For 14 × 3, the partial products are 30 and 12, which add to 42.", "spanishCognate": "Producto parcial"},
            {"term": "Divisible", "definition": "Capable of being evenly partitioned into equal groups with zero remainder.", "exampleSentence": "Every even number is divisible by 2.", "spanishCognate": "Divisible"}
        ],
        "assessments": ["Mid-Module 3 Assessment Task (Topics A–D)", "End-of-Module 3 Assessment Task (Topics A–G)"],
        "sourcePdf": "BLMATH-G3-M3-Teacher-ENG.pdf / BLMATH-G3-M3-Learn-ENG.pdf",
        "order": 3
    },
    {
        "id": "unit-math-m4",
        "subjectId": "subj-math",
        "subjectTitle": "Mathematics",
        "unitNumber": 4,
        "code": "M4",
        "title": "Module 4: Multiplication and Area",
        "subtitle": "Unit Squares, Rectangular Arrays, Area Formula & Additive Property of Composite Figures",
        "nineWeeks": "2nd Nine Weeks",
        "weekRange": "2nd & 3rd Nine Weeks • Weeks 17–18 (12/14–01/08)",
        "instructionalDays": 10,
        "teksStandards": ["3.4F", "3.6C", "3.6D"],
        "overview": "Students explore area as an attribute of two-dimensional figures, tiling rectangles with unit squares without gaps or overlaps, connecting rows × unit squares per row to multiplication, and decomposing composite figures into non-overlapping rectangles.",
        "learningObjectives": [
            "Determine the area of rectangles with whole-number side lengths using multiplication (rows × unit squares in each row).",
            "Find an unknown side length when given the area and one side length of a rectangle.",
            "Decompose composite figures formed by rectangles into non-overlapping rectangles to find total area."
        ],
        "vocabulary": [
            {"term": "Area", "definition": "The measurement attribute that describes the number of unit squares a figure or region covers.", "exampleSentence": "A rectangle with 4 rows of 6 square centimeters has an area of 24 square centimeters.", "spanishCognate": "Área"},
            {"term": "Square Unit", "definition": "A unit of area in the shape of a square that has side lengths of 1 unit.", "exampleSentence": "We measured the area in square inches and square centimeters.", "spanishCognate": "Unidad cuadrada"},
            {"term": "Tile", "definition": "To cover a region with unit squares without gaps or overlaps.", "exampleSentence": "Tile the rectangle with 15 square inch tiles.", "spanishCognate": "Cubrir con mosaicos"}
        ],
        "assessments": ["End-of-Module 4 Assessment Task (Topics A–B)"],
        "sourcePdf": "BLMATH-G3-M4-Teacher-ENG.pdf / BLMATH-G3-M4-Learn-ENG.pdf",
        "order": 4
    },
    {
        "id": "unit-math-m5",
        "subjectId": "subj-math",
        "subjectTitle": "Mathematics",
        "unitNumber": 5,
        "code": "M5",
        "title": "Module 5: Fractions as Numbers on the Number Line",
        "subtitle": "Unit Fractions, Partitioning Wholes, Number Line Distances, Equivalent Fractions & Comparing Fractions",
        "nineWeeks": "3rd Nine Weeks",
        "weekRange": "3rd Nine Weeks • Weeks 19–25 (01/11–02/26)",
        "instructionalDays": 36,
        "teksStandards": ["3.3A", "3.3B", "3.3C", "3.3D", "3.3E", "3.3F", "3.3G", "3.3H", "3.6E", "3.7A"],
        "overview": "Students transition from understanding fractions as equal parts of a shape to understanding fractions as points and distances on a number line, composing non-unit fractions from unit fractions, finding equivalent fractions, and comparing fractions with like numerators or like denominators.",
        "learningObjectives": [
            "Partition wholes into equal parts (halves, thirds, fourths, sixths, eighths) and compose fractions as a sum of unit fractions.",
            "Locate and represent fractions between 0 and 1 on a number line, including halves, fourths, and eighths.",
            "Determine and explain equivalent fractions using visual models and the same point on a number line.",
            "Compare two fractions having the same numerator or same denominator using <, >, or = and justify with models."
        ],
        "vocabulary": [
            {"term": "Unit Fraction", "definition": "A fraction with a numerator of 1 that represents one equal part of a whole (e.g., 1/2, 1/3, 1/4, 1/6, 1/8).", "exampleSentence": "The fraction 3/4 is composed of three copies of the unit fraction 1/4.", "spanishCognate": "Fracción unitaria"},
            {"term": "Equivalent Fractions", "definition": "Fractions that name the same size of a same-size whole or the exact same point on a number line.", "exampleSentence": "1/2 and 2/4 are equivalent fractions because they land on the same point on the number line.", "spanishCognate": "Fracciones equivalentes"},
            {"term": "Fractional Unit", "definition": "A unit created by partitioning a whole into a number of equal parts (halves, thirds, fourths, sixths, eighths).", "exampleSentence": "When a strip is folded into 8 equal parts, the fractional unit is eighths.", "spanishCognate": "Unidad fraccionaria"},
            {"term": "Partition", "definition": "To divide a whole shape or number line interval into equal parts.", "exampleSentence": "Partition the number line from 0 to 1 into 6 equal parts to show sixths.", "spanishCognate": "Particionar"}
        ],
        "assessments": ["Mid-Module 5 Assessment Task (Topics A–C)", "End-of-Module 5 Assessment Task (Topics A–F)"],
        "sourcePdf": "BLMATH-G3-M5-Teacher-ENG.pdf / BLMATH-G3-M5-Learn-ENG.pdf",
        "order": 5
    },
    {
        "id": "unit-math-m6",
        "subjectId": "subj-math",
        "subjectTitle": "Mathematics",
        "unitNumber": 6,
        "code": "M6",
        "title": "Module 6: Financial Literacy and Data",
        "subtitle": "Coins & Bills, Human Capital, Scarcity, Saving & Credit, Frequency Tables, Scaled Graphs & Dot Plots",
        "nineWeeks": "3rd Nine Weeks",
        "weekRange": "3rd Nine Weeks • Weeks 26–28 (03/01–03/12)",
        "instructionalDays": 17,
        "teksStandards": ["3.4C", "3.5E", "3.8A", "3.8B", "3.9A", "3.9B", "3.9C", "3.9D", "3.9E", "3.9F"],
        "overview": "Students count collections of coins and bills, explore human capital and income, supply/scarcity and cost, planned/unplanned spending, saving, credit and interest, and represent and solve one- and two-step problems using frequency tables, scaled pictographs, scaled bar graphs, and dot plots.",
        "learningObjectives": [
            "Determine the value of a collection of coins and bills.",
            "Explain human capital/labor and income, resource scarcity and cost, saving, credit, borrower responsibility, and interest.",
            "Create and analyze frequency tables, scaled bar graphs, pictographs, and dot plots to solve one- and two-step problems.",
            "Represent real-world relationships using number pairs in a table."
        ],
        "vocabulary": [
            {"term": "Credit", "definition": "Buying or obtaining goods and services now with an agreement to pay in the future.", "exampleSentence": "When you use credit, the borrower must pay the lender back, usually with interest.", "spanishCognate": "Crédito"},
            {"term": "Interest", "definition": "Extra money paid for borrowing money or making purchases on credit.", "exampleSentence": "Paying back a loan with interest costs more than the original price.", "spanishCognate": "Interés"},
            {"term": "Dot Plot", "definition": "A graph that represents data along a horizontal line where each value is shown by a dot in a vertical column.", "exampleSentence": "The dot plot shows that 89 prizes was the most frequent score.", "spanishCognate": "Diagrama de puntos"},
            {"term": "Frequency Table", "definition": "A table that lists categories or items and shows the number of times each occurs.", "exampleSentence": "We organized the class survey results into a frequency table.", "spanishCognate": "Tabla de frecuencia"},
            {"term": "Scaled Graph", "definition": "A bar graph or pictograph with a scale that uses units greater than 1.", "exampleSentence": "In this scaled bar graph, each grid line represents 5 students.", "spanishCognate": "Gráfica a escala"}
        ],
        "assessments": ["End-of-Module 6 Assessment Task (Topics A–C)"],
        "sourcePdf": "BLMATH-G3-M6-Teacher-ENG.pdf / BLMATH-G3-M6-Learn-ENG.pdf",
        "order": 6
    },
    {
        "id": "unit-math-m7",
        "subjectId": "subj-math",
        "subjectTitle": "Mathematics",
        "unitNumber": 7,
        "code": "M7",
        "title": "Module 7: Geometry and Measurement Word Problems",
        "subtitle": "2D Polygons & Quadrilaterals, 3D Solids, Perimeter, Missing Side Lengths & Area vs. Perimeter",
        "nineWeeks": "4th Nine Weeks",
        "weekRange": "4th Nine Weeks • Weeks 29–33 (03/22–04/23)",
        "instructionalDays": 23,
        "teksStandards": ["3.4K", "3.5A", "3.5B", "3.6A", "3.6B", "3.6C", "3.7B", "3.8A"],
        "overview": "Students classify and sort 2D polygons (especially quadrilaterals: rhombuses, parallelograms, trapezoids, rectangles, squares) and 3D solids (cones, cylinders, spheres, prisms, cubes), calculate perimeter and unknown side lengths, and solve multi-operation word problems comparing area and perimeter.",
        "learningObjectives": [
            "Classify and sort 2D polygons and 3D solids (cones, cylinders, spheres, triangular and rectangular prisms, cubes) by attributes (faces, edges, vertices).",
            "Recognize rhombuses, parallelograms, trapezoids, rectangles, and squares as subcategories of quadrilaterals.",
            "Determine the perimeter of a polygon or a missing side length when given the perimeter and remaining side lengths.",
            "Solve one- and two-step word problems involving area, perimeter, and all four operations."
        ],
        "vocabulary": [
            {"term": "Perimeter", "definition": "The boundary or total length around the boundary of a two-dimensional shape.", "exampleSentence": "A rectangle with side lengths 4 cm and 2 cm has a perimeter of 4 + 2 + 4 + 2 = 12 cm.", "spanishCognate": "Perímetro"},
            {"term": "Regular Polygon", "definition": "A polygon with all equal side lengths and equal interior angles.", "exampleSentence": "A regular hexagon with a perimeter of 24 inches has 6 sides of 4 inches each.", "spanishCognate": "Polígono regular"},
            {"term": "Quadrilateral", "definition": "A four-sided polygon with four angles, including trapezoids, parallelograms, rectangles, rhombuses, and squares.", "exampleSentence": "Every square is a rectangle, a rhombus, a parallelogram, and a quadrilateral.", "spanishCognate": "Cuadrilátero"},
            {"term": "Edge & Face", "definition": "A face is a flat 2D surface of a 3D solid; an edge is the line segment where two faces meet.", "exampleSentence": "A triangular prism has 5 faces, 9 edges, and 6 vertices.", "spanishCognate": "Cara y arista"}
        ],
        "assessments": ["Mid-Module 7 Assessment Task (Topics A–C)", "End-of-Module 7 Assessment Task (Topics A–E)"],
        "sourcePdf": "BLMATH-G3-M7-Teacher-ENG.pdf / BLMATH-G3-M7-Learn-ENG.pdf",
        "order": 7
    },

    # ================= READING LANGUAGE ARTS (10 UNITS) =================
    {
        "id": "unit-rla-u1",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 1,
        "code": "RLA-U1",
        "title": "Unit 1: Classic Tales: The Wind in the Willows",
        "subtitle": "Literary Elements, Character Analysis, Plot Sequencing, Themes, Point of View & Opinion Writing",
        "nineWeeks": "1st Nine Weeks",
        "weekRange": "1st Nine Weeks • Weeks 1–4 (08/19–09/11)",
        "instructionalDays": 15,
        "teksStandards": ["3.1A", "3.2A.ii", "3.2D", "3.4", "3.6C", "3.6D", "3.6G", "3.7B", "3.7C", "3.7D", "3.7G", "3.8A", "3.8B", "3.8C", "3.8D", "3.10D", "3.10E", "3.11A-E", "3.12C"],
        "overview": "Students listen to and analyze Kenneth Grahame's classic tale The Wind in the Willows alongside Reader selections 'Aladdin and the Wonderful Lamp' and 'Alice's Adventures in Wonderland,' exploring personification, perspective, plot sequence, character traits, and themes of friendship, loyalty, hospitality, and responsibility.",
        "learningObjectives": [
            "Analyze characters' internal and external traits, motivations, and relationships (Mole, Water Rat, Badger, Mr. Toad).",
            "Identify and sequence plot elements (rising action, climax, falling action, resolution) and setting.",
            "Explain literary themes of friendship, loyalty, hospitality, and responsibility using text evidence.",
            "Identify point of view (first-person vs. third-person) and personification, and write an opinion paragraph."
        ],
        "vocabulary": [
            {"term": "Meandered", "definition": "Wandered or wound slowly and gently without a straight path.", "exampleSentence": "The river meandered peacefully through the green English countryside."},
            {"term": "Dejected", "definition": "Sad, low-spirited, and discouraged.", "exampleSentence": "Mole felt dejected after the boat overturned in the cold river."},
            {"term": "Summoned", "definition": "Called upon or gathered courage or someone to come.", "exampleSentence": "Rat summoned his courage and knocked on Mr. Badger's door."},
            {"term": "Reproached", "definition": "Expressed disappointment or disapproval toward someone for their actions.", "exampleSentence": "Rat reproached Mole for wandering into the Wild Wood alone."},
            {"term": "Conceited", "definition": "Having an excessively high opinion of oneself; vain and boastful.", "exampleSentence": "Mr. Toad was conceited and bragged constantly about how clever he was."},
            {"term": "Recklessly", "definition": "Acting carelessly without thinking or caring about danger or consequences.", "exampleSentence": "Toad drove the motorcar recklessly down the country lane."}
        ],
        "assessments": ["Beginning-of-Year (BOY) Silent Reading & Word Reading Assessment (Lessons 6–10)", "Opinion Paragraph Performance Task"],
        "sourcePdf": "BLRLA-G3-U1-Teacher-ENG.pdf / BLRLA-G3-U1-Reader-ENG.pdf",
        "readerTitle": "Classic Tales (The Wind in the Willows, Aladdin, Alice in Wonderland)",
        "order": 1
    },
    {
        "id": "unit-rla-u2",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 2,
        "code": "RLA-U2",
        "title": "Unit 2: Scales, Feathers, and Fur: Animal Classification",
        "subtitle": "Informational Text Features, Central Idea, Vertebrates vs. Invertebrates & Text Structures",
        "nineWeeks": "1st Nine Weeks",
        "weekRange": "1st Nine Weeks • Weeks 5–8 (09/14–10/09)",
        "instructionalDays": 15,
        "teksStandards": ["3.1A", "3.2A.vi", "3.2B.vii", "3.2D", "3.3B", "3.3C", "3.6B", "3.6E", "3.6F", "3.6G", "3.6H", "3.7B", "3.7C", "3.7E", "3.7F", "3.9D.i-iii", "3.10A-C", "3.12B"],
        "overview": "Guided by narrator Rattenborough, students read informational texts classifying animals into vertebrates and invertebrates, warm-blooded and cold-blooded organisms, and the five vertebrate groups: fish, amphibians, reptiles, birds, and mammals.",
        "learningObjectives": [
            "Use text features (headings, captions, diagrams, bold print, glossaries) to locate information in informational texts.",
            "Determine the central idea and supporting details about vertebrate and invertebrate animal groups.",
            "Compare and contrast warm-blooded and cold-blooded animals and explain how scientists classify living things.",
            "Identify prefixes (un-, non-, re-, pre-) and root words, and compose an informational paragraph."
        ],
        "vocabulary": [
            {"term": "Vertebrate", "definition": "An animal that has a backbone (spinal column).", "exampleSentence": "Fish, amphibians, reptiles, birds, and mammals are all vertebrates.", "spanishCognate": "Vertebrado"},
            {"term": "Invertebrate", "definition": "An animal that does not have a backbone.", "exampleSentence": "Insects, spiders, and jellyfish are invertebrates.", "spanishCognate": "Invertebrado"},
            {"term": "Metamorphosis", "definition": "A complete change of physical form or structure during an animal's life cycle.", "exampleSentence": "Tadpoles undergo metamorphosis as they grow legs and lungs to become adult frogs.", "spanishCognate": "Metamorfosis"},
            {"term": "Aquatic", "definition": "Living or growing in or near water.", "exampleSentence": "Fish are aquatic animals that breathe oxygen through gills.", "spanishCognate": "Acuático"}
        ],
        "assessments": ["Unit 2 Reading Comprehension & Informational Writing Assessment (Lesson 15)"],
        "sourcePdf": "BLRLA-G3-U2-Teacher-ENG.pdf / BLRLA-G3-U2-Reader-ENG.pdf",
        "readerTitle": "Rattenborough's Guide to Animals",
        "order": 2
    },
    {
        "id": "unit-rla-u3",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 3,
        "code": "RLA-U3",
        "title": "Unit 3: The Human Body: Systems and Senses",
        "subtitle": "Skeletal, Muscular, and Nervous Systems, Sight & Hearing, Context Clues & Explanatory Writing",
        "nineWeeks": "2nd Nine Weeks",
        "weekRange": "2nd Nine Weeks • Weeks 9–12 (10/13–10/30)",
        "instructionalDays": 13,
        "teksStandards": ["3.1A", "3.2A.iv", "3.2B.iv", "3.2D", "3.3B", "3.3C", "3.6B", "3.6F", "3.6G", "3.6H", "3.7B", "3.7C", "3.7D", "3.9D.i", "3.11B-D", "3.12B"],
        "overview": "Dr. Welbody introduces students to the interconnected systems of the human body—the skeletal system, muscular system, nervous system, and the senses of vision and hearing—while practicing topic sentences, concluding sentences, and regular/irregular plural nouns.",
        "learningObjectives": [
            "Explain how the skeletal, muscular, and nervous systems work together to allow the human body to move and think.",
            "Describe how the parts of the eye and ear function to provide vision and hearing.",
            "Synthesize details across paragraphs to retell and paraphrase informational texts.",
            "Decode and use prefixes dis- and mis- and write well-structured explanatory paragraphs."
        ],
        "vocabulary": [
            {"term": "Voluntary", "definition": "Done by choice; controlled consciously by a person's brain.", "exampleSentence": "Bicep muscles are voluntary muscles because you choose when to bend your arm.", "spanishCognate": "Voluntario"},
            {"term": "Involuntary", "definition": "Happening automatically without conscious control.", "exampleSentence": "Your heart beating is controlled by involuntary cardiac muscle.", "spanishCognate": "Involuntario"},
            {"term": "Cartilage", "definition": "Strong, flexible tissue that cushions bones at joints and shapes the nose and ears.", "exampleSentence": "Cartilage keeps your bones from rubbing together at your knees.", "spanishCognate": "Cartílago"},
            {"term": "Receptors", "definition": "Special nerve cells that receive signals from light, sound, or touch and send messages to the brain.", "exampleSentence": "Sensory receptors in your skin alert your brain when something is hot.", "spanishCognate": "Receptores"}
        ],
        "assessments": ["Unit 3 Assessment: The Human Body Systems & Senses (Lesson 13)"],
        "sourcePdf": "BLRLA-G3-U3-Teacher-ENG.pdf / BLRLA-G3-U3-Reader-ENG.pdf",
        "readerTitle": "How Does Your Body Work?",
        "order": 3
    },
    {
        "id": "unit-rla-u4",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 4,
        "code": "RLA-U4",
        "title": "Unit 4: The Ancient Roman Civilization",
        "subtitle": "Roman Mythology, Republic to Empire, Julius & Augustus Caesar, Literary Myths vs. Historical Nonfiction",
        "nineWeeks": "2nd Nine Weeks",
        "weekRange": "2nd Nine Weeks • Weeks 13–15 (11/02–11/20)",
        "instructionalDays": 13,
        "teksStandards": ["3.1A", "3.2B.i", "3.2D", "3.3B", "3.3C", "3.4", "3.6C", "3.6E", "3.6F", "3.6G", "3.7B", "3.7C", "3.7D", "3.8B", "3.8C", "3.9A", "3.9D.i", "3.9E", "3.10A", "3.12C"],
        "overview": "Students explore the rise and legacy of Ancient Rome—from the legend of Romulus and Remus and Roman mythology to the Roman Republic, Julius Caesar, Augustus Caesar, Roman architecture (aqueducts, Colosseum, Pantheon), and the decline of the Empire.",
        "learningObjectives": [
            "Distinguish between historical nonfiction and traditional Roman myths and legends.",
            "Analyze historical figures (Julius Caesar, Augustus, Cleopatra, Constantine) and their impact on Roman history.",
            "Use suffixes (-y, -al, -ist, -ian) and past/present/future verb tenses accurately.",
            "Write a persuasive/argumentative opinion essay supported by historical text evidence."
        ],
        "vocabulary": [
            {"term": "Republic", "definition": "A form of government in which citizens elect representatives to make laws and vote.", "exampleSentence": "Before emperors ruled, Ancient Rome was governed as a republic by the Senate.", "spanishCognate": "República"},
            {"term": "Patricians", "definition": "Wealthy, noble upper-class ruling families in Ancient Rome.", "exampleSentence": "Patricians held the highest positions in the early Roman Senate.", "spanishCognate": "Patricios"},
            {"term": "Plebeians", "definition": "Ordinary working citizens and farmers of Ancient Rome.", "exampleSentence": "Plebeians worked hard to gain a voice and fair laws in the Roman government.", "spanishCognate": "Plebeyos"},
            {"term": "Aqueduct", "definition": "A bridge-like stone channel built by Romans to carry fresh water from distant hills into cities.", "exampleSentence": "Roman engineers constructed stone aqueducts that stood for centuries.", "spanishCognate": "Acueducto"}
        ],
        "assessments": ["Unit 4 Assessment: Ancient Rome (Lesson 13)"],
        "sourcePdf": "BLRLA-G3-U4-Teacher-ENG.pdf / BLRLA-G3-U4-Reader-ENG.pdf",
        "readerTitle": "Stories of Ancient Rome",
        "order": 4
    },
    {
        "id": "unit-rla-u5",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 5,
        "code": "RLA-U5",
        "title": "Unit 5: Flash, Bang, Boom! Exploring Light and Sound",
        "subtitle": "Reflection, Refraction, Lenses, Color Spectrum, Sound Vibrations, Pitch/Volume & Research Newspaper Article",
        "nineWeeks": "2nd Nine Weeks",
        "weekRange": "2nd & 3rd Nine Weeks • Weeks 16–18 (11/30–12/17)",
        "instructionalDays": 16,
        "teksStandards": ["3.1A", "3.2A.vii", "3.2B.i", "3.2D", "3.3A", "3.3B", "3.3C", "3.6C", "3.6F", "3.6G", "3.6H", "3.7C", "3.7E", "3.7F", "3.9D.i-iii", "3.10A", "3.12B", "3.13A-G"],
        "overview": "Students investigate the physics of light (wavelengths, reflection, mirrors, refraction, concave/convex lenses, prisms) and sound (vibrations, sound waves, pitch, intensity, human voice) plus biographies of Alexander Graham Bell and Thomas Edison, culminating in writing a newspaper article.",
        "learningObjectives": [
            "Explain cause-and-effect relationships in scientific texts about reflection, refraction, and sound vibrations.",
            "Use graphic features and diagrams to understand how light travels through lenses and how sound travels through mediums.",
            "Use suffixes -ous and -ly and conjunctions (and, but, because, so) to connect ideas.",
            "Research and write an informative newspaper article about an invention (telephone or incandescent lightbulb)."
        ],
        "vocabulary": [
            {"term": "Refraction", "definition": "The bending of a light wave when it passes from one transparent medium into another, such as air into water.", "exampleSentence": "Refraction makes a straw in a glass of water look bent.", "spanishCognate": "Refracción"},
            {"term": "Opaque", "definition": "Not allowing light to pass through, creating a shadow.", "exampleSentence": "A wooden door is opaque because no light can shine through it.", "spanishCognate": "Opaco"},
            {"term": "Transparent", "definition": "Allowing light to pass through clearly so objects behind can be distinctly seen.", "exampleSentence": "Clear window glass is transparent.", "spanishCognate": "Transparente"},
            {"term": "Vibration", "definition": "A rapid back-and-forth movement that creates sound waves.", "exampleSentence": "Plucking a guitar string causes a vibration that travels through the air to your ear.", "spanishCognate": "Vibración"}
        ],
        "assessments": ["Unit 5 Assessment & Newspaper Article Research Rubric (Lessons 14–16)"],
        "sourcePdf": "BLRLA-G3-U5-Teacher-ENG.pdf / BLRLA-G3-U5-Reader-ENG.pdf",
        "readerTitle": "Adventures in Light and Sound",
        "order": 5
    },
    {
        "id": "unit-rla-u6",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 6,
        "code": "RLA-U6",
        "title": "Unit 6: Astronomy: Our Solar System and Beyond",
        "subtitle": "Inner & Outer Planets, Asteroids/Comets/Meteors, Galaxies, Gravity, Copernicus, Mae Jemison & Informative Essay",
        "nineWeeks": "3rd Nine Weeks",
        "weekRange": "3rd Nine Weeks • Weeks 19–22 (01/05–01/29)",
        "instructionalDays": 18,
        "teksStandards": ["3.1A", "3.2A.iii", "3.2B.iv", "3.2D", "3.3C", "3.4", "3.6B", "3.6E", "3.6F", "3.6G", "3.6H", "3.7B", "3.7C", "3.7E", "3.9C", "3.9D", "3.10A", "3.12B"],
        "overview": "Students journey across our solar system and universe—studying the Sun, inner rocky planets, outer gas giants, asteroids, meteors, comets, stars, constellations, galaxies (Milky Way, Andromeda), gravity, Nicolaus Copernicus, the Space Shuttle, and astronaut Mae Jemison.",
        "learningObjectives": [
            "Compare and contrast inner planets and outer planets, and distinguish between asteroids, meteoroids, meteors, and comets.",
            "Analyze the structure of drama/Reader's Theater in the play about Nicolaus Copernicus.",
            "Explain how gravity holds planets in orbit around the Sun and moons in orbit around planets.",
            "Use suffixes -ful and -less and quotation marks, and write a multi-paragraph informative essay."
        ],
        "vocabulary": [
            {"term": "Gravity", "definition": "The invisible force of attraction that pulls objects with mass toward one another.", "exampleSentence": "The Sun's strong gravity keeps Earth and the other planets in orbit.", "spanishCognate": "Gravedad"},
            {"term": "Galaxy", "definition": "A massive system of billions of stars, gas, and dust held together by gravity.", "exampleSentence": "Our solar system is located in the Milky Way galaxy.", "spanishCognate": "Galaxia"},
            {"term": "Eclipse", "definition": "An astronomical event where one celestial body moves into the shadow of another.", "exampleSentence": "During a solar eclipse, the Moon passes directly between Earth and the Sun.", "spanishCognate": "Eclipse"},
            {"term": "Hypothesis", "definition": "An idea or explanation that can be tested through observation and investigation.", "exampleSentence": "Copernicus formed the heliocentric hypothesis that Earth orbits the Sun.", "spanishCognate": "Hipótesis"}
        ],
        "assessments": ["Middle-of-Year (MOY) Benchmark Assessment & Unit 6 Informative Essay"],
        "sourcePdf": "BLRLA-G3-U6-Teacher-ENG.pdf / BLRLA-G3-U6-Reader-ENG.pdf",
        "readerTitle": "What's in Our Universe?",
        "order": 6
    },
    {
        "id": "unit-rla-u7",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 7,
        "code": "RLA-U7",
        "title": "Unit 7: Learning from the Land: Native American Regions and Cultures",
        "subtitle": "Beringia Migration, Mississippi Mound Builders, Southwest/Pueblo, Northeast, Caddo & Tejas of Texas, Arctic",
        "nineWeeks": "3rd Nine Weeks",
        "weekRange": "3rd Nine Weeks • Weeks 23–25 (02/01–02/19)",
        "instructionalDays": 13,
        "teksStandards": ["3.1A", "3.2A.i-ii", "3.2B.iv", "3.2D", "3.3A", "3.3C", "3.3D", "3.4", "3.6C", "3.6F", "3.6G", "3.6H", "3.7B", "3.7C", "3.7D", "3.8B", "3.8C", "3.9B", "3.9D.iii", "3.10C"],
        "overview": "Students explore how Native American peoples adapted to diverse geographic regions across North America—including the Mississippi River Mound Builders, Pueblo peoples of the Southwest, the Caddo and Tejas nations of Texas, Eastern Woodland tribes, and Inuit peoples of the Arctic—through historical narratives and informational texts.",
        "learningObjectives": [
            "Explain cause-and-effect relationships between geographic environments and Native American shelter, food, and culture.",
            "Analyze fictional historical narratives ('Akando and Aponi', 'Alemeda, the Basket Weaver', 'Adoette and Awan') alongside informational chapters.",
            "Apply suffixes -able and -ible and possessive nouns/pronouns.",
            "Compare cultural traditions, including the Texas folktale 'Texas Paintbrush'."
        ],
        "vocabulary": [
            {"term": "Nomadic", "definition": "Moving from place to place in search of food and water rather than living in one permanent settlement.", "exampleSentence": "Early mammoth hunters lived a nomadic life following animal herds.", "spanishCognate": "Nómada"},
            {"term": "Adobe", "definition": "Sun-dried bricks made of clay, mud, and straw used for building homes in the Southwest.", "exampleSentence": "Pueblo homes built of thick adobe stayed cool during hot desert afternoons.", "spanishCognate": "Adobe"},
            {"term": "Confederacy", "definition": "An alliance or league of groups or tribes united for mutual support and peace.", "exampleSentence": "The Caddo confederacy in East Texas was known as the Hasinai, meaning 'our own folk.'", "spanishCognate": "Confederación"}
        ],
        "assessments": ["Unit 7 Assessment: Native American Regions and Cultures (Lesson 13)"],
        "sourcePdf": "BLRLA-G3-U7-Teacher-ENG.pdf / BLRLA-G3-U7-Reader-ENG.pdf",
        "readerTitle": "Native American Stories",
        "order": 7
    },
    {
        "id": "unit-rla-u8",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 8,
        "code": "RLA-U8",
        "title": "Unit 8: Travelers from Other Lands: Early Explorations of North America",
        "subtitle": "Columbus, Ponce de León, De Soto, Coronado in Texas/Southwest, Cabot, Hudson & Champlain",
        "nineWeeks": "3rd Nine Weeks",
        "weekRange": "3rd Nine Weeks • Weeks 26–28 (02/22–03/12)",
        "instructionalDays": 14,
        "teksStandards": ["3.1A", "3.2A.v", "3.2B.i", "3.2D", "3.3A", "3.3B", "3.3C", "3.4", "3.6C", "3.6E", "3.6F", "3.6G", "3.6H", "3.7B", "3.7C", "3.7D", "3.7E", "3.9D", "3.10A", "3.12A", "3.12C"],
        "overview": "Students study the motivations, voyages, challenges, and consequences of European exploration of North America—from Christopher Columbus, Juan Ponce de León, Hernando de Soto, and Francisco Vásquez de Coronado in the Southwest/Texas to John Cabot, Henry Hudson, and Samuel de Champlain in the search for the Northwest Passage.",
        "learningObjectives": [
            "Identify the motivations (spice trade, gold, Northwest Passage, colonization) and routes of early European explorers.",
            "Compare multiple perspectives of exploration, including impacts on Native American populations.",
            "Use prefixes pro-, anti-, uni-, bi-, tri- and linking words (for example, in conclusion, furthermore).",
            "Write a structured opinion essay evaluating explorer achievements and challenges."
        ],
        "vocabulary": [
            {"term": "Expedition", "definition": "A journey undertaken by a group of people with a specific purpose, especially exploration.", "exampleSentence": "Coronado led a large expedition across the American Southwest and the Texas Panhandle.", "spanishCognate": "Expedición"},
            {"term": "Navigation", "definition": "The science of planning and directing the course of a ship using maps, compasses, and stars.", "exampleSentence": "Sailors used an astrolabe and compass for ocean navigation.", "spanishCognate": "Navegación"},
            {"term": "Mutiny", "definition": "An open rebellion by sailors against the captain of a ship.", "exampleSentence": "Henry Hudson's crew staged a mutiny in the icy waters of Hudson Bay.", "spanishCognate": "Motín"}
        ],
        "assessments": ["Unit 8 Assessment: Early Explorations of North America (Lesson 14)"],
        "sourcePdf": "BLRLA-G3-U8-Teacher-ENG.pdf / BLRLA-G3-U8-Reader-ENG.pdf",
        "readerTitle": "The Age of Exploration",
        "order": 8
    },
    {
        "id": "unit-rla-u9",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 9,
        "code": "RLA-U9",
        "title": "Unit 9: Colonial America",
        "subtitle": "Roanoke, Jamestown, Plymouth/Mayflower Compact, New England, Middle & Southern Colonies, Road to Revolution",
        "nineWeeks": "4th Nine Weeks",
        "weekRange": "4th Nine Weeks • Weeks 29–32 (03/22–04/16)",
        "instructionalDays": 17,
        "teksStandards": ["3.1A", "3.2A.v", "3.2B.i", "3.2D", "3.3B", "3.3C", "3.4", "3.6B", "3.6C", "3.6F", "3.6G", "3.6H", "3.7B", "3.7C", "3.7D", "3.8C", "3.8D", "3.9D", "3.11A-E", "3.12A"],
        "overview": "Students trace the founding and daily life of the Thirteen English Colonies across the Southern, New England, and Middle regions—including Roanoke, Jamestown, Plymouth, the Massachusetts Bay Colony, William Penn and the Quakers, colonial trades, and the events leading toward the American Revolution.",
        "learningObjectives": [
            "Compare and contrast geography, climate, economy, and daily life across the Southern, New England, and Middle Colonies.",
            "Analyze historical narratives from the perspectives of colonial children alongside informational history chapters.",
            "Apply prefixes im-, in-, non- and comparative/superlative adjectives (-er, -est, more, most).",
            "Write a narrative story set in Colonial America using dialogue and descriptive details."
        ],
        "vocabulary": [
            {"term": "Colony", "definition": "A region settled and ruled by people from a distant country.", "exampleSentence": "Jamestown became the first permanent English colony in North America in 1607.", "spanishCognate": "Colonia"},
            {"term": "Self-Government", "definition": "The ability of citizens in a community to make their own laws and govern themselves.", "exampleSentence": "The Mayflower Compact was an early agreement for self-government.", "spanishCognate": "Autogobierno"},
            {"term": "Apprentice", "definition": "A young person who learns a skilled trade or craft by working for a master craftsman.", "exampleSentence": "The printer's apprentice learned how to set metal type for the colonial newspaper.", "spanishCognate": "Aprendiz"},
            {"term": "Boycott", "definition": "To refuse to buy or use certain goods as a protest.", "exampleSentence": "Colonists organized a boycott of British tea to protest unfair taxes."}
        ],
        "assessments": ["Unit 9 Assessment: Colonial America (Lesson 17)"],
        "sourcePdf": "BLRLA-G3-U9-Teacher-ENG.pdf / BLRLA-G3-U9-Reader-ENG.pdf",
        "readerTitle": "Living in Colonial America",
        "order": 9
    },
    {
        "id": "unit-rla-u10",
        "subjectId": "subj-rla",
        "subjectTitle": "Reading Language Arts",
        "unitNumber": 10,
        "code": "RLA-U10",
        "title": "Unit 10: All That Jazz (Research Unit)",
        "subtitle": "Jazz Roots, Harlem Renaissance, Louis Armstrong, Billie Holiday, Tito Puente, Duke Ellington & Research Essay",
        "nineWeeks": "4th Nine Weeks",
        "weekRange": "4th Nine Weeks • Weeks 33–36 (04/19–05/27)",
        "instructionalDays": 11,
        "teksStandards": ["3.1A", "3.1C", "3.2D", "3.3B", "3.6B", "3.6E", "3.6G", "3.6H", "3.6I", "3.7B", "3.7E", "3.9D", "3.10A", "3.10C", "3.10D", "3.11A-E", "3.12B", "3.13A-H"],
        "overview": "Students explore the vibrant music, poetry, and history of the Jazz Age and Harlem Renaissance—studying Louis Armstrong, Billie Holiday, Langston Hughes, Benny Goodman, Teddy Wilson, Tito Puente, and Duke Ellington—while conducting formal inquiry and research to write and present a biography essay with Works Cited.",
        "learningObjectives": [
            "Generate research questions, distinguish primary and secondary sources, and cite reliable sources in a Works Cited list.",
            "Evaluate details across biographies and informational texts to determine key ideas and author's voice.",
            "Paraphrase information in one's own words to avoid plagiarism.",
            "Compose, revise, edit, and present a research essay about a celebrated jazz musician."
        ],
        "vocabulary": [
            {"term": "Improvisation", "definition": "Creating and performing music spontaneously in the moment without written sheet music.", "exampleSentence": "Louis Armstrong was famous for his joyful trumpet improvisation.", "spanishCognate": "Improvisación"},
            {"term": "Renaissance", "definition": "A rebirth or lively revival of art, literature, music, and learning.", "exampleSentence": "The Harlem Renaissance celebrated African American music, poetry, and visual art.", "spanishCognate": "Renacimiento"},
            {"term": "Harmony & Melody", "definition": "Melody is the main tune of a song; harmony is the combination of musical notes played together to support the melody.", "exampleSentence": "The jazz band blended brass harmony with a swinging piano melody.", "spanishCognate": "Armonía y melodía"}
        ],
        "assessments": ["Grade 3 End-of-Year (EOY) Assessment & Research Essay / Presentation Rubric"],
        "sourcePdf": "BLRLA-G3-U10-Teacher-ENG.pdf",
        "readerTitle": "All That Jazz Trade Books & Research Texts",
        "order": 10
    },

    # ================= FOUNDATIONAL SKILLS (10 UNITS) =================
    {
        "id": "unit-fs-u1",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 1,
        "code": "FS-U1",
        "title": "Foundational Skills 1: Consonant Digraphs, Trigraphs & Syllable Division (VC/CV, VC/V, VCCCV)",
        "subtitle": "Digraphs (wh, sh, th, ng, nk, ck, ch/tch, dge/ge, ph/gh, kn/gn), Trigraphs (igh, ear, air, are) & Closed Syllables",
        "nineWeeks": "1st Nine Weeks",
        "weekRange": "1st Nine Weeks • Days 1–17",
        "instructionalDays": 17,
        "teksStandards": ["3.1A", "3.1C", "3.1D", "3.2A.ii", "3.2A.iv", "3.2A.vii", "3.2B.i", "3.2B.v", "3.2D", "3.3A", "3.3B", "3.4", "3.5"],
        "overview": "Students review and master consonant digraphs and trigraphs (wh, sh, th, ng, nk, ck, ch, tch, dge, ge, ph, gh, kn, gn, igh, ear, eer, ere, ore, air, are) and apply VC/CV, VC/V, and VCCCV syllable division rules to decode and encode multisyllabic words while reading Campfire Tales.",
        "learningObjectives": [
            "Decode and spell words with common and advanced consonant digraphs and trigraphs (tch, dge, ph, gh, kn, gn, igh, ear, air).",
            "Divide multisyllabic words into syllables using VC/CV, VC/V, and VCCCV patterns.",
            "Read grade-level decodable texts (Campfire Tales) with accuracy, automaticity, and prosody."
        ],
        "vocabulary": [
            {"term": "Digraph", "definition": "Two letters that work together to make a single sound (such as sh, ch, ph, kn).", "exampleSentence": "In the word 'phone', the digraph ph makes the /f/ sound.", "phonicsPattern": "wh, sh, th, ck, ch, ph, kn, gn"},
            {"term": "Trigraph", "definition": "Three letters that work together to represent a single sound (such as tch, dge, igh, ear).", "exampleSentence": "In the word 'bridge', the trigraph dge makes the /j/ sound after a short vowel.", "phonicsPattern": "tch, dge, igh, ear, air, are"},
            {"term": "Closed Syllable", "definition": "A syllable ending in one or more consonants after a single vowel, giving the vowel a short sound.", "exampleSentence": "The word 'picnic' has two closed syllables: pic/nic.", "phonicsPattern": "VC/CV"}
        ],
        "assessments": ["Unit 1 Fluency Assessment (Lesson 15)", "Unit 1 Reading & Spelling Assessment (Lesson 16)"],
        "sourcePdf": "BLFS-G3-U1-Teacher-ENG.pdf / BLFS-G3-U1-Reader-ENG.pdf",
        "readerTitle": "Campfire Tales",
        "trickyWords": ["laugh", "enough", "tough", "island", "castle", "wilderness"],
        "highFrequencyWords": ["spring", "swept", "picnic", "basket", "lunch", "night", "thought", "follow"],
        "order": 1
    },
    {
        "id": "unit-fs-u2",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 2,
        "code": "FS-U2",
        "title": "Foundational Skills 2: V/CV Syllable Division, Open Syllables & Suffixes (–ed, –ing)",
        "subtitle": "Open Syllables, V/CV vs. VC/V Division, Multiple-Meaning Context Clues & Inflectional Endings",
        "nineWeeks": "1st Nine Weeks",
        "weekRange": "1st Nine Weeks • Days 18–33",
        "instructionalDays": 16,
        "teksStandards": ["3.1B", "3.1D", "3.2A.ii", "3.2A.iv", "3.2A.vii", "3.2B.i", "3.2B.v", "3.2B.vii", "3.2D", "3.3A", "3.3B", "3.3C", "3.4", "3.5"],
        "overview": "Students decode and encode multisyllabic words with open syllables using the V/CV division pattern, use context clues to determine the meaning of multiple-meaning words, and apply spelling rules for inflectional suffixes -ed and -ing while reading A Talk with Animals.",
        "learningObjectives": [
            "Decode and spell multisyllabic words with open syllables using the V/CV syllable division pattern (e.g., ti/ger, ro/bot, mu/sic).",
            "Use context clues within and beyond a sentence to determine meanings of multiple-meaning words.",
            "Decode and spell base words with inflectional suffixes -ed and -ing."
        ],
        "vocabulary": [
            {"term": "Open Syllable", "definition": "A syllable that ends with a single vowel, which usually makes its long vowel sound.", "exampleSentence": "In 'ba/con' and 'pi/lot', the first syllable is an open syllable with a long vowel.", "phonicsPattern": "V/CV"},
            {"term": "Inflectional Suffix", "definition": "An ending like -ed or -ing added to a verb to show past or ongoing action.", "exampleSentence": "Adding -ed to 'jump' makes 'jumped', showing the action happened in the past.", "phonicsPattern": "-ed, -ing"}
        ],
        "assessments": ["Unit 2 Fluency Assessment (Lesson 14)", "Unit 2 Reading & Spelling Assessment (Lesson 15)"],
        "sourcePdf": "BLFS-G3-U2-Teacher-ENG.pdf / BLFS-G3-U2-Reader-ENG.pdf",
        "readerTitle": "A Talk with Animals",
        "trickyWords": ["engine", "curious", "dangerous", "leopard", "camouflage", "territorial", "favorite", "successful"],
        "highFrequencyWords": ["talk", "walk", "head", "eyes", "book", "being", "run", "drink", "long", "much", "group"],
        "order": 2
    },
    {
        "id": "unit-fs-u3",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 3,
        "code": "FS-U3",
        "title": "Foundational Skills 3: Split Digraphs (VCe) & Consonant/Vowel Suffixes",
        "subtitle": "Magic-e / Split Digraphs (a_e, i_e, o_e, u_e), Dropping Final Silent-e & Soft c/g Suffix Rules",
        "nineWeeks": "2nd Nine Weeks",
        "weekRange": "2nd Nine Weeks • Days 34–49",
        "instructionalDays": 16,
        "teksStandards": ["3.1A", "3.1B", "3.1D", "3.2A.ii", "3.2A.vi", "3.2A.vii", "3.2B.i", "3.2B.vii", "3.2D", "3.3A", "3.3B", "3.3C", "3.4", "3.5"],
        "overview": "Students master multisyllabic words with VCe split digraphs (a_e, i_e, o_e, u_e) and learn the spelling rules for adding consonant suffixes (keep the e, as in hopeful) versus vowel suffixes (drop the final e, as in hoping; except keeping e for soft c/g before -able/-ous) while reading Healthy Humans.",
        "learningObjectives": [
            "Read and spell multisyllabic words containing VCe split digraphs (a_e, i_e, o_e, u_e).",
            "Apply the Drop-the-Final-e rule when adding vowel suffixes (-ing, -ed, -er, -est) to VCe base words.",
            "Read and spell words with consonant suffixes (-ful, -less, -ly, -ment, -ness) attached to VCe syllables."
        ],
        "vocabulary": [
            {"term": "Split Digraph (VCe)", "definition": "A vowel-consonant-silent 'e' pattern where the silent 'e' makes the preceding vowel say its long name.", "exampleSentence": "In 'compete' and 'reptile', the second syllable has a VCe split digraph.", "phonicsPattern": "a_e, i_e, o_e, u_e"},
            {"term": "Vowel Suffix Rule", "definition": "When adding a suffix that begins with a vowel to a VCe word, drop the silent 'e' (hope + ing = hoping).", "exampleSentence": "We drop the final 'e' in 'bake' before adding '-ing' to spell 'baking'.", "phonicsPattern": "Drop final e"}
        ],
        "assessments": ["Unit 3 Fluency Assessment (Lesson 14)", "Unit 3 Reading & Spelling Assessment (Lesson 15)"],
        "sourcePdf": "BLFS-G3-U3-Teacher-ENG.pdf / BLFS-G3-U3-Reader-ENG.pdf",
        "readerTitle": "Healthy Humans: How to Keep Your Body Strong",
        "trickyWords": ["muscles", "building", "blood", "soldier", "bacteria", "sugar", "pressure", "intestines", "tissues"],
        "highFrequencyWords": ["grow", "become", "better", "open", "food", "carry", "clean", "feet", "while"],
        "order": 3
    },
    {
        "id": "unit-fs-u4",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 4,
        "code": "FS-U4",
        "title": "Foundational Skills 4: Vowel Teams (ee, ea, ai, ay, ue), Prefixes, Suffixes & Homophones",
        "subtitle": "Long Vowel Teams, Prefixes (un–, dis–, mis–, re–, pre–), Suffixes (–ist, –ian, –al) & Homophones",
        "nineWeeks": "2nd Nine Weeks",
        "weekRange": "2nd Nine Weeks • Days 50–65",
        "instructionalDays": 16,
        "teksStandards": ["3.1A", "3.1B", "3.1D", "3.2A.ii", "3.2A.v", "3.2A.vi", "3.2A.vii", "3.2B.i", "3.2B.ii", "3.2B.vi", "3.2B.vii", "3.2D", "3.3A", "3.3B", "3.3C", "3.3D", "3.4", "3.5"],
        "overview": "Students decode and encode multisyllabic words with vowel teams (ee, ea, ai, ay, ue), analyze how prefixes (un-, dis-, mis-, re-, pre-) and suffixes (-ist, -ian, -al) change word meanings and parts of speech, and identify and spell homophones while reading Frankie Figures It Out.",
        "learningObjectives": [
            "Read and spell multisyllabic words with long vowel teams ee, ea, ai, ay, and ue.",
            "Determine how prefixes (un-, dis-, mis-, re-, pre-) and suffixes (-ist, -ian, -al) change the meaning of base words.",
            "Identify, explain, and spell common homophones in context."
        ],
        "vocabulary": [
            {"term": "Vowel Team", "definition": "Two vowels working together in the same syllable to make one vowel sound.", "exampleSentence": "The words 'exceed', 'season', 'explain', and 'rescue' all contain vowel teams.", "phonicsPattern": "ee, ea, ai, ay, ue"},
            {"term": "Homophones", "definition": "Words that sound the exact same when spoken aloud but have different spellings and meanings.", "exampleSentence": "'Their', 'there', and 'they're' are homophones.", "phonicsPattern": "Homophones"}
        ],
        "assessments": ["Unit 4 Fluency Assessment (Lesson 14)", "Unit 4 Reading & Spelling Assessment (Lesson 15)"],
        "sourcePdf": "BLFS-G3-U4-Teacher-ENG.pdf / BLFS-G3-U4-Reader-ENG.pdf",
        "readerTitle": "Frankie Figures It Out",
        "trickyWords": ["adventure", "lifeguard", "delicious", "library"],
        "highFrequencyWords": ["always", "sometimes", "said", "something", "idea", "fall", "draw", "paper", "never", "last", "today"],
        "order": 4
    },
    {
        "id": "unit-fs-u5",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 5,
        "code": "FS-U5",
        "title": "Foundational Skills 5: R-Controlled Syllables (er, ir, ur, ar, or) & Suffixes (–y, –ous, –ly, –ive, –en)",
        "subtitle": "Bossy-R Multisyllabic Words, Derivational Suffixes & VCCCV Accent Shifts",
        "nineWeeks": "2nd Nine Weeks",
        "weekRange": "2nd & 3rd Nine Weeks • Days 66–82",
        "instructionalDays": 17,
        "teksStandards": ["3.1A", "3.1B", "3.1D", "3.2A.i", "3.2A.ii", "3.2A.iv", "3.2A.vii", "3.2B.i", "3.2B.iv", "3.2B.v", "3.2D", "3.3A", "3.3B", "3.3C", "3.4", "3.5"],
        "overview": "Students master r-controlled syllables (er, ir, ur, ar, or), learn how suffixes -y, -ous, -ly, -ive, and -en transform words, and practice VCCCV syllable division and accent shifts while reading Adventures of Marcus and Cory.",
        "learningObjectives": [
            "Decode and spell multisyllabic words with r-controlled vowel syllables (er, ir, ur, ar, or).",
            "Apply suffixes -y, -ous, -ly, -ive, and -en and explain how they change a word's meaning and part of speech.",
            "Divide VCCCV words accurately and recognize accent shifts."
        ],
        "vocabulary": [
            {"term": "R-Controlled Syllable", "definition": "A syllable in which a vowel is followed by the letter 'r', changing the vowel sound (er, ir, ur, ar, or).", "exampleSentence": "In 'car/pen/ter' and 'sur/prise', the vowels are controlled by the letter r.", "phonicsPattern": "er, ir, ur, ar, or"}
        ],
        "assessments": ["Unit 5 Fluency Assessment (Lesson 14)", "Unit 5 Reading & Spelling Assessment (Lesson 15)"],
        "sourcePdf": "BLFS-G3-U5-Teacher-ENG.pdf / BLFS-G3-U5-Reader-ENG.pdf",
        "readerTitle": "Adventures of Marcus and Cory",
        "trickyWords": ["sorry", "guitar", "library", "figure", "silhouettes", "carousel"],
        "highFrequencyWords": ["hear", "saw", "those", "close", "stop", "got", "might", "light", "white", "warm"],
        "order": 5
    },
    {
        "id": "unit-fs-u6",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 6,
        "code": "FS-U6",
        "title": "Foundational Skills 6: Contractions, Final Stable Syllables (–ble, –dle, –gle, –tle, –cle) & Spelling Rules",
        "subtitle": "Consonant + le Syllables, Suffixes –ful/–less, Double Final Consonant, Drop Final e & Change y to i",
        "nineWeeks": "3rd Nine Weeks",
        "weekRange": "3rd Nine Weeks • Days 83–99",
        "instructionalDays": 17,
        "teksStandards": ["3.1A", "3.1B", "3.1C", "3.2A.ii", "3.2A.iii", "3.2A.vi", "3.2A.vii", "3.2B.i", "3.2B.iii", "3.2B.vii", "3.2D", "3.3A", "3.3B", "3.3C", "3.4", "3.5"],
        "overview": "Students form and decode contractions, read and divide two- and three-syllable words with final stable syllables (-ble, -dle, -gle, -sle, -zle, -ple, -cle, -kle, -ckle, -cal), and master the three core suffix spelling rules: Double the Final Consonant (1-1-1 rule), Drop the e, and Change y to i while reading To the Stars: Lily Explores Space.",
        "learningObjectives": [
            "Read and spell contractions with not, is, are, will, and had using apostrophes accurately.",
            "Decode and divide multisyllabic words ending in final stable Consonant + le syllables.",
            "Apply the three suffix spelling rules: double final consonant, drop final silent e, and change y to i."
        ],
        "vocabulary": [
            {"term": "Final Stable Syllable", "definition": "An unaccented final syllable containing a consonant plus -le (or -cal) that stays together when dividing syllables.", "exampleSentence": "In 'tum/ble', 'spar/kle', and 'bi/cy/cle', the final syllable is a Consonant + le syllable.", "phonicsPattern": "-ble, -dle, -gle, -ple, -cle, -ckle"},
            {"term": "Contraction", "definition": "A shortened form of two words where an apostrophe replaces the missing letter or letters.", "exampleSentence": "'Doesn't' is a contraction of 'does not', and 'we'll' is a contraction of 'we will'.", "phonicsPattern": "Apostrophe contractions"}
        ],
        "assessments": ["Unit 6 Fluency Assessment (Lesson 14)", "Unit 6 Reading & Spelling Assessment (Lesson 15)"],
        "sourcePdf": "BLFS-G3-U6-Teacher-ENG.pdf / BLFS-G3-U6-Reader-ENG.pdf",
        "readerTitle": "To the Stars: Lily Explores Space",
        "trickyWords": ["through", "thought", "spaghetti", "beautiful", "journeys", "diamond", "suggested", "knowledge"],
        "highFrequencyWords": ["earth", "life", "high", "done", "mountains", "together", "often", "under"],
        "order": 6
    },
    {
        "id": "unit-fs-u7",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 7,
        "code": "FS-U7",
        "title": "Foundational Skills 7: Diphthongs (/aw/ aw, au; /ou/ ow, ou; /oi/ oy, oi), Homographs & Suffixes (–able, –ible)",
        "subtitle": "Vowel Diphthongs, Homophones vs. Homographs & Suffixes –able and –ible",
        "nineWeeks": "3rd Nine Weeks",
        "weekRange": "3rd Nine Weeks • Days 100–116",
        "instructionalDays": 17,
        "teksStandards": ["3.1A", "3.1B", "3.1C", "3.1D", "3.2A.ii", "3.2A.vii", "3.2B.i", "3.2B.ii", "3.2B.vii", "3.2D", "3.3A", "3.3B", "3.3C", "3.3D", "3.4", "3.5"],
        "overview": "Students read and spell words with diphthongs (/aw/ spelled aw, au; /ou/ spelled ow, ou; /oi/ spelled oy, oi), distinguish homophones from homographs, and apply suffixes -able and -ible while reading Everyday Heroes.",
        "learningObjectives": [
            "Decode and spell multisyllabic words with vowel diphthongs aw, au, ow, ou, oy, and oi.",
            "Identify and explain homographs (same spelling, different meaning/pronunciation) and homophones.",
            "Read and spell words with suffixes -able and -ible."
        ],
        "vocabulary": [
            {"term": "Diphthong", "definition": "A gliding vowel sound where the mouth moves from one vowel position to another within a single syllable.", "exampleSentence": "The words 'launch', 'mountain', 'royal', and 'choice' contain vowel diphthongs.", "phonicsPattern": "aw, au, ow, ou, oy, oi"},
            {"term": "Homograph", "definition": "Words that are spelled the exact same way but have different meanings and sometimes different pronunciations.", "exampleSentence": "'Wind' (moving air) and 'wind' (to turn a clock key) are homographs.", "phonicsPattern": "Homographs"}
        ],
        "assessments": ["Unit 7 Fluency Assessment (Lesson 14)", "Unit 7 Reading & Spelling Assessment (Lesson 15)"],
        "sourcePdf": "BLFS-G3-U7-Teacher-ENG.pdf / BLFS-G3-U7-Reader-ENG.pdf",
        "readerTitle": "Everyday Heroes",
        "trickyWords": ["accidental", "breathe", "patient", "temperature", "ancient", "unusual", "patrolling"],
        "highFrequencyWords": ["hurt", "near", "begin", "both", "start", "above", "once", "example"],
        "order": 7
    },
    {
        "id": "unit-fs-u8",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 8,
        "code": "FS-U8",
        "title": "Foundational Skills 8: Vowel Teams (oo, ew, ue, ui), Abbreviations & Prefixes (anti–, in–, pro–)",
        "subtitle": "Homophone Mastery, /oo/ Vowel Teams, Common Abbreviations & Latin/Greek Prefixes",
        "nineWeeks": "3rd Nine Weeks",
        "weekRange": "3rd & 4th Nine Weeks • Days 117–133",
        "instructionalDays": 17,
        "teksStandards": ["3.1A", "3.1B", "3.1D", "3.2A.ii", "3.2A.iii", "3.2A.v", "3.2A.vii", "3.2B.i", "3.2B.ii", "3.2B.iii", "3.2B.vi", "3.2D", "3.3A", "3.3B", "3.3C", "3.3D", "3.4", "3.5"],
        "overview": "Students master homophone spelling, decode and spell vowel teams oo, ew, ue, and ui, read and write common abbreviations (Dr., Mr., Mrs., Ave., St., months/days), and analyze prefixes anti-, in-, and pro- while reading The Other Side of the World.",
        "learningObjectives": [
            "Decode and spell words with vowel teams oo (as in moon and book), ew, ue, and ui.",
            "Read and write standard abbreviations for titles, streets, days, and months.",
            "Determine the meaning of words with prefixes anti-, in-, and pro-."
        ],
        "vocabulary": [
            {"term": "Abbreviation", "definition": "A shortened form of a written word or phrase, usually ending with a period.", "exampleSentence": "Dr. is the abbreviation for Doctor, and Ave. is the abbreviation for Avenue.", "phonicsPattern": "Abbreviations"}
        ],
        "assessments": ["Unit 8 Fluency Assessment (Lesson 14)", "Unit 8 Reading & Spelling Assessment (Lesson 15)"],
        "sourcePdf": "BLFS-G3-U8-Teacher-ENG.pdf / BLFS-G3-U8-Reader-ENG.pdf",
        "readerTitle": "The Other Side of the World",
        "trickyWords": ["Australia", "structure", "algae", "culture", "sanctuary", "marsupial", "Melbourne", "penguin"],
        "highFrequencyWords": ["side", "without", "family", "country", "city", "try", "sea", "took", "kind"],
        "order": 8
    },
    {
        "id": "unit-fs-u9",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 9,
        "code": "FS-U9",
        "title": "Foundational Skills 9: Synonyms, Antonyms, Affixes (im–, non–, –ful) & Soft c/g Multisyllabic Words",
        "subtitle": "Semantic Relationships, Homophones/Homographs, Soft 'c' (/s/) and Soft 'g' (/j/) & Suffix Spelling Rules",
        "nineWeeks": "4th Nine Weeks",
        "weekRange": "4th Nine Weeks • Days 134–149",
        "instructionalDays": 16,
        "teksStandards": ["3.1A", "3.1B", "3.1C", "3.1D", "3.2A.i", "3.2A.ii", "3.2A.v", "3.2A.vi", "3.2A.vii", "3.2B.i", "3.2B.ii", "3.2B.iv", "3.2B.vi", "3.2B.vii", "3.2C", "3.2D", "3.3A", "3.3B", "3.3C", "3.3D", "3.4", "3.5"],
        "overview": "Students identify and explain synonyms and antonyms, analyze prefixes im- and non- and suffix -ful, decode multisyllabic words with soft c (ce, ci, cy) and soft g (ge, gi, gy), and consolidate suffix spelling rules while reading George Meets Mr. Henry.",
        "learningObjectives": [
            "Identify and explain synonyms, antonyms, homophones, and homographs in context.",
            "Decode and spell multisyllabic words containing soft 'c' (/s/) and soft 'g' (/j/).",
            "Apply prefixes im- and non- and suffix spelling rules (double consonant, drop e, change y to i)."
        ],
        "vocabulary": [
            {"term": "Synonyms & Antonyms", "definition": "Synonyms are words with similar meanings; antonyms are words with opposite meanings.", "exampleSentence": "'Brave' and 'courageous' are synonyms, while 'ancient' and 'modern' are antonyms.", "phonicsPattern": "Synonyms / Antonyms"},
            {"term": "Soft c and Soft g", "definition": "When 'c' or 'g' is followed by e, i, or y, 'c' usually makes the /s/ sound and 'g' usually makes the /j/ sound.", "exampleSentence": "The words 'celebrate', 'citizen', 'giant', and 'energy' follow the soft c and soft g rule.", "phonicsPattern": "ce, ci, cy, ge, gi, gy"}
        ],
        "assessments": ["Unit 9 Fluency Assessment (Lesson 14)", "Unit 9 Reading & Spelling Assessment (Lesson 15)"],
        "sourcePdf": "BLFS-G3-U9-Teacher-ENG.pdf / BLFS-G3-U9-Reader-ENG.pdf",
        "readerTitle": "George Meets Mr. Henry",
        "trickyWords": ["Williamsburg", "Virginia", "Massachusetts", "immediately", "militia", "gone"],
        "highFrequencyWords": ["father", "own", "open", "few", "along", "plant", "last", "only", "young"],
        "order": 9
    },
    {
        "id": "unit-fs-u10",
        "subjectId": "subj-fs",
        "subjectTitle": "Foundational Skills",
        "unitNumber": 10,
        "code": "FS-U10",
        "title": "Foundational Skills 10: Spelling Patterns (eigh, ough), Compound Words, Affixes & Idioms",
        "subtitle": "Advanced Patterns eigh/ough, Final Stable Syllables, Abbreviations, Compound Words & Figurative Idioms",
        "nineWeeks": "4th Nine Weeks",
        "weekRange": "4th Nine Weeks • Days 150–165",
        "instructionalDays": 16,
        "teksStandards": ["3.1A", "3.1B", "3.1C", "3.1D", "3.1E", "3.2A.i-vi", "3.2B.i-vii", "3.2D", "3.3A", "3.3B", "3.3C", "3.3D", "3.4", "3.5"],
        "overview": "Students master the advanced spelling patterns eigh and ough, review final stable syllables (-ble, -tle, -gle), decode and spell compound words, apply affixes (im-, in-, pre-, -ness, -y, -ful), and interpret common idioms while reading the Unit 10 Reader.",
        "learningObjectives": [
            "Decode and spell words with advanced spelling patterns 'eigh' (/ay/) and 'ough'.",
            "Read and spell closed and open compound words and words with multiple affixes.",
            "Identify and explain the non-literal meanings of common English idioms in context."
        ],
        "vocabulary": [
            {"term": "Compound Word", "definition": "A word formed by joining two smaller standalone words together to create a new meaning.", "exampleSentence": "'Campfire', 'lighthouse', and 'thunderstorm' are compound words.", "phonicsPattern": "Compound Words"},
            {"term": "Idiom", "definition": "A phrase or expression whose figurative meaning cannot be understood from the literal meanings of its individual words.", "exampleSentence": "'Break a leg' is an idiom that means 'good luck' before a stage performance.", "phonicsPattern": "Idioms"}
        ],
        "assessments": ["End-of-Year (EOY) Fluency, Reading & Spelling Assessments (Lessons 14–15)"],
        "sourcePdf": "BLFS-G3-U10-Teacher-ENG.pdf / BLFS-G3-U10-Reader-ENG.pdf",
        "readerTitle": "Unit 10 Reader: The Show Must Go On",
        "trickyWords": ["brilliant", "journey", "technique", "rhythm", "language", "distinguishing", "doubt", "conquer", "natural", "annual", "routines"],
        "highFrequencyWords": ["eight", "school", "song", "enough", "watch", "show", "almost", "list"],
        "order": 10
    }
]

print(f"Prepared {len(subjects)} subjects and {len(units)} units.")

