import re

file_path = r"c:\xampp\htdocs\buits_react_inertia\inertia-auth-app\public\img\ultra_hero.svg"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Grid Size to 10px
content = re.sub(r'width="[0-9]+" height="[0-9]+" patternUnits="userSpaceOnUse"', 'width="10" height="10" patternUnits="userSpaceOnUse"', content)
content = re.sub(r'<rect width="[0-9]+" height="[0-9]+" fill="white" />', '<rect width="10" height="10" fill="white" />', content)
content = re.sub(r'd="M [0-9]+ 0 L 0 0 0 [0-9]+"', 'd="M 10 0 L 0 0 0 10"', content)
content = re.sub(r'd="M 0 [0-9]+ L [0-9]+ [0-9]+"', 'd="M 0 10 L 10 10"', content)

# 2. Remove all existing <style>...</style> blocks
content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)

# 3. Define the new CSS
new_style = """
    <style>
        /* Chips Styles */
        @keyframes float-chip {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
        }
        .float-chip-1 { animation: float-chip 8s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .float-chip-2 { animation: float-chip 7s ease-in-out infinite 2s; transform-origin: center; transform-box: fill-box; }
        .float-chip-3 { animation: float-chip 9s ease-in-out infinite 1s; transform-origin: center; transform-box: fill-box; }
        .float-chip-4 { animation: float-chip 10s ease-in-out infinite 3s; transform-origin: center; transform-box: fill-box; }
        .float-chip-5 { animation: float-chip 11s ease-in-out infinite 0.5s; transform-origin: center; transform-box: fill-box; }
        .float-chip-6 { animation: float-chip 6s ease-in-out infinite 4s; transform-origin: center; transform-box: fill-box; }
        .float-chip-7 { animation: float-chip 9s ease-in-out infinite 1.5s; transform-origin: center; transform-box: fill-box; }
        .float-chip-8 { animation: float-chip 8.5s ease-in-out infinite 2.5s; transform-origin: center; transform-box: fill-box; }
        
        .chip-group rect {
            fill: none;
            stroke: none;
            transition: all 0.3s ease;
        }
        .chip-group text {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            font-size: 6px;
            font-weight: 600;
            fill: #00C066; 
            text-anchor: middle;
            dominant-baseline: middle;
            pointer-events: none;
        }
        .comment-text {
            font-size: 5.5px;
            opacity: 0;
            transition: opacity 0.3s ease;
            fill: #9CA3AF;
        }
        .chip-group:hover .comment-text {
            opacity: 0.9;
        }
        .chip-group:hover text {
            fill: #00d66c;
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
            font-size: 20px; 
            text-anchor: middle; 
            fill: #00C066; 
        }
    </style>
"""

# Inject into the first <defs> block
content = content.replace('</defs>', new_style + '</defs>', 1)

# 4. Clean up end of file
last_defs_pos = content.rfind('</defs>')
if last_defs_pos != -1:
    content = content[:last_defs_pos + 7] + "\n</svg>"

# 5. Inject New Content (Tightly clustered around center 716, 120)
# ViewBox: 0 0 1433 257. Clustering range: X: 350-1080, Y: 30-220
new_elements = """
    <!-- Main Slogan with Typing Animation -->
    <g class="typing-text-group" transform="translate(716, 120)">
        <text class="text-typing" style="animation-delay: 0s;">Barishal University IT Society</text>
        <text class="text-typing" style="animation-delay: 4s;">Innovation | Community</text>
        <text class="text-typing" style="animation-delay: 8s;">Tech | Leadership | Robotics</text>
        <text class="text-typing" style="animation-delay: 12s;">Design | Build | Scale</text>
    </g>

    <!-- 8 Floating Code Chips (Tightly Orbital Clustering) -->
    
    <!-- Top Left of Cluster -->
    <g class="float-chip-5 chip-group">
        <rect x="380" y="55" width="140" height="18" />
        <text x="420" y="64">[student for student in campus if creative]</text>
        <text x="420" y="70" class="comment-text">// Find the innovators</text>
    </g>

    <!-- Top Center -->
    <g class="float-chip-7 chip-group">
        <rect x="650" y="35" width="110" height="18" />
        <text x="705" y="44">git commit -m "innovation"</text>
        <text x="705" y="50" class="comment-text">// Share the spark</text>
    </g>

    <!-- Top Right of Cluster -->
    <g class="float-chip-2 chip-group">
        <rect x="850" y="60" width="100" height="18" />
        <text x="900" y="69">torch.nn.Society()</text>
        <text x="900" y="75" class="comment-text">// The collective network</text>
    </g>

    <!-- Center Left -->
    <g class="float-chip-1 chip-group">
        <rect x="420" y="110" width="80" height="18" />
        <text x="460" y="119">build(future);</text>
        <text x="460" y="125" class="comment-text">// Shape tomorrow</text>
    </g>

    <!-- Center Right -->
    <g class="float-chip-8 chip-group">
        <rect x="950" y="120" width="110" height="18" />
        <text x="1005" y="129">docker run society</text>
        <text x="1005" y="135" class="comment-text">// Orchestrating growth</text>
    </g>

    <!-- Bottom Left -->
    <g class="float-chip-3 chip-group">
        <rect x="450" y="180" width="90" height="18" />
        <text x="495" y="189">await Tech(unlock)</text>
        <text x="495" y="195" class="comment-text">// Unlock potential</text>
    </g>

    <!-- Bottom Center -->
    <g class="float-chip-4 chip-group">
        <rect x="710" y="210" width="90" height="18" />
        <text x="755" y="219">Arrays.asList("learn")</text>
        <text x="755" y="225" class="comment-text">// Never stop growing</text>
    </g>

    <!-- Bottom Right -->
    <g class="float-chip-6 chip-group">
        <rect x="920" y="190" width="100" height="18" />
        <text x="970" y="199">chmod +x curiosity.sh</text>
        <text x="970" y="205" class="comment-text">// Permission to explore</text>
    </g>
"""

content = content.replace('</svg>', new_elements + '</svg>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SVG modified: All 8 chips clustered tightly around slogan.")
