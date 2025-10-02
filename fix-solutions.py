#!/usr/bin/env python3
"""Fix Solutions section by removing extra closing divs"""

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Track if we're in the solutions section
in_solutions = False
fixed_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # Detect start of solutions section
    if '<div class="row masonry">' in line and i > 270 and i < 280:
        in_solutions = True
        fixed_lines.append(line)
        i += 1
        continue

    # Detect end of solutions section
    if in_solutions and '<!--End row-->' in line and 'solutions' not in lines[i-10:i][-1]:
        in_solutions = False

    # If we're in solutions section and find the pattern of duplicate closing divs
    if in_solutions and '</div>' in line.strip() and '</div>' == line.strip():
        # Check if the next line is also a closing div
        if i + 1 < len(lines) and '</div>' in lines[i+1].strip() and '</div>' == lines[i+1].strip():
            # Check if the line after that is a closing div for col-md-3
            if i + 2 < len(lines) and '</div>' in lines[i+2].strip():
                # Skip the middle duplicate div
                fixed_lines.append(line)  # Keep first </div> (closes .item)
                i += 1  # Skip the duplicate
                i += 1  # Move to the column closing div
                continue

    fixed_lines.append(line)
    i += 1

# Write fixed content
with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print("Fixed Solutions section - removed duplicate closing divs")
