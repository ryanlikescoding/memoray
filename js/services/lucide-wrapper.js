(function() {
    // Wait for Lucide to be available
    if (!window.lucide) {
        console.error('Lucide library not found on window.lucide');
        return;
    }

    const { icons, createIcons } = window.lucide;
    const { createElement, useRef, useEffect } = React;

    // Helper function to convert CamelCase to kebab-case
    const toKebab = (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    const IconWrapper = ({ name, size = 24, color = "currentColor", strokeWidth = 2, className = "", ...props }) => {
        const ref = useRef(null);

        useEffect(() => {
            if (!ref.current) return;

            // Create a temporary container
            const temp = document.createElement('div');
            const i = document.createElement('i');
            
            // Lucide uses data-lucide attribute with kebab-case name
            const iconName = toKebab(name);
            i.setAttribute('data-lucide', iconName);
            temp.appendChild(i);

            // Render the icon into the temp container
            // We pass only the specific icon we want to render to avoid scanning the document
            const iconDef = icons[name];
            if (!iconDef) {
                console.warn(`Icon ${name} not found in lucide icons`);
                return;
            }

            // We use createIcons but restricts it to our temp root
            createIcons({
                root: temp,
                icons: { [name]: iconDef },
                attrs: {
                    width: size,
                    height: size,
                    stroke: color,
                    'stroke-width': strokeWidth,
                    class: className,
                    ...props
                },
                nameAttr: 'data-lucide'
            });

            // Extract the SVG
            const svg = temp.querySelector('svg');
            if (svg) {
                ref.current.innerHTML = '';
                ref.current.appendChild(svg);
            }
        }, [name, size, color, strokeWidth, className, props]); // Props in dep array might be tricky if object, but mostly ok for primitives

        return createElement('span', { 
            ref: ref, 
            className: `lucide-icon-wrapper ${className}`,
            style: { display: 'inline-flex', lineHeight: 0 } 
        });
    };

    // Create the lucideReact global object
    const lucideReact = {};
    
    // Map all available icons
    Object.keys(icons).forEach(key => {
        lucideReact[key] = (props) => createElement(IconWrapper, { name: key, ...props });
    });

    window.lucideReact = lucideReact;
    console.log('Lucide React wrapper initialized with ' + Object.keys(icons).length + ' icons');
})();
