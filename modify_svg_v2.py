import re

file_path = r"c:\xampp\htdocs\buits_react_inertia\inertia-auth-app\public\img\ultra_hero.svg"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove all existing <style>...</style> blocks
content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)

# 2. Find the first <defs> block and inject the new style there
new_style = """
    <style>
        /* Chips Styles */
        @keyframes float-chip {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1deg); }
        }
        .float-chip-1 { animation: float-chip 8s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .float-chip-2 { animation: float-chip 7s ease-in-out infinite 2s; transform-origin: center; transform-box: fill-box; }
        .float-chip-3 { animation: float-chip 9s ease-in-out infinite 1s; transform-origin: center; transform-box: fill-box; }
        .float-chip-4 { animation: float-chip 8s ease-in-out infinite 3s; transform-origin: center; transform-box: fill-box; }
        .float-chip-5 { animation: float-chip 6s ease-in-out infinite 0.5s; transform-origin: center; transform-box: fill-box; }
        .float-chip-6 { animation: float-chip 10s ease-in-out infinite 4s; transform-origin: center; transform-box: fill-box; }
        
        .chip-group rect {
            fill: rgba(0, 192, 102, 0.05);
            stroke: rgba(0, 192, 102, 0.2);
            stroke-width: 1.5;
            transition: all 0.3s ease;
        }
        .chip-group:hover rect {
            fill: rgba(0, 192, 102, 0.15);
            stroke: rgba(0, 192, 102, 0.5);
        }
        .chip-group text {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            font-size: 13px;
            font-weight: 600;
            fill: #00C066; 
            text-anchor: middle;
            dominant-baseline: middle;
            pointer-events: none;
        }

        @keyframes typing-effect {
            0% { opacity: 0; clip-path: inset(0 100% 0 0); }
            5%, 20% { opacity: 1; clip-path: inset(0 0 0 0); }
            25%, 100% { opacity: 0; clip-path: inset(0 0 0 0); }
        }
        .text-typing { 
            opacity: 0; 
            animation: typing-effect 16s ease-out infinite; 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            font-weight: 700; 
            font-size: 28px; 
            text-anchor: middle; 
            fill: #00C066; 
        }
    </style>
"""

# Inject into the first <defs> block
content = content.replace('</defs>', new_style + '</defs>', 1)

# 3. Clean up the end of the file. 
# We want to remove everything after the LAST </defs> except the final </svg>
# and then inject our new elements.
last_defs_pos = content.rfind('</defs>')
if last_defs_pos != -1:
    content = content[:last_defs_pos + 7] + "\n</svg>"

# 4. Inject new elements before </svg>
new_elements = """
    <!-- Main Slogan with Typing Animation -->
    <g class="typing-text-group" transform="translate(716, 120)">
        <text class="text-typing" style="animation-delay: 0s;">Barishal University IT Society</text>
        <text class="text-typing" style="animation-delay: 4s;">Innovation | Community</text>
        <text class="text-typing" style="animation-delay: 8s;">Tech | Leadership | Robotics</text>
        <text class="text-typing" style="animation-delay: 12s;">Design | Build | Scale</text>
    </g>

    <!-- Floating Code Chips -->
    <g class="float-chip-1 chip-group">
        <rect x="450" y="40" width="120" height="36" rx="18" />
        <text x="510" y="58">UI/UXxx Design</text>
    </g>
    <g class="float-chip-2 chip-group">
        <rect x="850" y="30" width="120" height="36" rx="18" />
        <text x="910" y="48">Robotics</text>
    </g>
    <g class="float-chip-3 chip-group">
        <rect x="380" y="110" width="130" height="36" rx="18" />
        <text x="445" y="128">Leadership</text>
    </g>
    <g class="float-chip-4 chip-group">
        <rect x="980" y="100" width="140" height="36" rx="18" />
        <text x="1050" y="118">Community</text>
    </g>
    <g class="float-chip-5 chip-group">
        <rect x="420" y="180" width="130" height="36" rx="18" />
        <text x="485" y="198">Event Mgmt.</text>
    </g>
    <g class="float-chip-6 chip-group">
        <rect x="880" y="190" width="120" height="36" rx="18" />
        <text x="940" y="208">Content HQ</text>
    </g>
"""

content = content.replace('</svg>', new_elements + '</svg>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SVG modified successfully.")
