import type { ReactElement } from "react";
import type { ItemProp } from "@/types/items";

function interpolateTemplate(
    template: string,
    values: string[],
    color: string,
    variableColor: string
): ReactElement {
    const parts = template.split(/({{(\d+)}})/);

    return (
        <div className={color}>
            {parts.map((part, index) => {
                if (/^\d+$/.test(part)) {
                    return null;
                }

                const match = part.match(/{{(\d+)}}/);
                if (match) {
                    const valueIndex = parseInt(match[1]) - 1;
                    return (
                        <span key={index} className={variableColor}>
                            {values[valueIndex]}
                        </span>
                    );
                }
                return part;
            })}
        </div>
    );
}

interface ItemAffixProps {
    affix: ItemProp;
    color: string;
    variableColor: string;
}

export default function ItemAffix({ affix, color, variableColor }: ItemAffixProps) {
    const template = affix[0];
    const values = affix.slice(1) || [];

    return interpolateTemplate(template, values, color, variableColor);
}
