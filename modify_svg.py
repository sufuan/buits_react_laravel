import re
import os

with open("public/img/ultra_hero.svg", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the background rect with a grid pattern
new_rect = """<defs>
        <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(128, 128, 128, 0.15)" stroke-width="1"/>
            <path d="M 20 0 L 20 40" fill="none" stroke="rgba(128, 128, 128, 0.05)" stroke-width="0.5"/>
            <path d="M 0 20 L 40 20" fill="none" stroke="rgba(128, 128, 128, 0.05)" stroke-width="0.5"/>
        </pattern>
    </defs>
    <rect width="1433" height="257" fill="url(#grid-pattern)" />"""

content = re.sub(r'<rect width="1433" height="257" fill="white" />', new_rect, content)

if new_rect not in content:
    print("Failed to replace background rect")

# Add styles for our new elements in <style>
new_style = """
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
                    fill: rgba(0, 192, 102, 0.05); /* very light green/translucent */
                    stroke: rgba(0, 192, 102, 0.2);
                    stroke-width: 1.5;
                }
                .chip-group text {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    fill: rgba(255,255,255,0.7); /* We'll use lighter text since it scrolls to dark bg later, wait, what if the bg is white initially?
                       Let's make the chips text adapt or be a specific color like #00C066 for brand consistency */
                }
                .chip-group text { fill: #00C066; font-weight: 600; }

                @keyframes typing-effect {
                    0% { opacity: 1; clip-path: inset(0 100% 0 0); }
                    10%, 20% { opacity: 1; clip-path: inset(0 -10% 0 0); }
                    25%, 100% { opacity: 0; clip-path: inset(0 -10% 0 0); }
                }
                .text-1, .text-2, .text-3, .text-4 { 
                    opacity: 0; 
                    animation: typing-effect 16s ease-out infinite; 
                    font-family: 'Inter', system-ui, -apple-system, sans-serif; 
                    font-weight: 500; 
                    font-size: 24px; 
                    text-anchor: middle; 
                    fill: #00C066; 
                }
                .text-1 { animation-delay: 0s; }
                .text-2 { animation-delay: 4s; }
                .text-3 { animation-delay: 8s; }
                .text-4 { animation-delay: 12s; }
"""

# Append inside <style>
content = re.sub(r'(\.typing-text\s*\{[^}]*\}\s*)', r'\1' + new_style, content)

# Now rebuild the typing text and chips
new_text_group = """
        <!-- Floating Inclusive Chips -->
        <g class="float-chip-1 chip-group">
            <rect x="250" y="40" width="100" height="34" rx="17" />
            <text x="300" y="62">UI/UX Design</text>
        </g>
        <g class="float-chip-2 chip-group">
            <rect x="160" y="150" width="80" height="34" rx="17" />
            <text x="200" y="172">Leadership</text>
        </g>
        <g class="float-chip-3 chip-group">
            <rect x="420" y="90" width="70" height="34" rx="17" />
            <text x="455" y="112">Robotics</text>
        </g>
        <g class="float-chip-4 chip-group">
            <rect x="980" y="130" width="90" height="34" rx="17" />
            <text x="1025" y="152">Event Mgmt.</text>
        </g>
        <g class="float-chip-5 chip-group">
            <rect x="1100" y="50" width="85" height="34" rx="17" />
            <text x="1142" y="72">Content HQ</text>
        </g>
        <g class="float-chip-6 chip-group">
            <rect x="1230" y="180" width="80" height="34" rx="17" />
            <text x="1270" y="202">Community</text>
        </g>

        <!-- Typing Animation Replaced -->
        <g class="typing-text-replaced">
            <text x="716" y="100" class="text-1">Tech | Design</text>
            <text x="716" y="100" class="text-2">Tech | Leadership</text>
            <text x="716" y="100" class="text-3">Tech | Community</text>
            <text x="716" y="100" class="text-4">Tech | Beyond Code</text>
        </g>
"""

# Replace the text block
content = re.sub(r'<g class="typing-text">\s*<text x="716" y="100" class="banner-slogan">Tech\s*\|\s*Reck\s*\|\s*Make</text>\s*</g>', new_text_group, content, flags=re.MULTILINE)

with open("public/img/ultra_hero.svg", "w", encoding="utf-8") as f:
    f.write(content)

print("SVG Modified Successfully")
