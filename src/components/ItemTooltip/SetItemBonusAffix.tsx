import type { ReactElement } from "react";
import type { ItemProp } from "@/types/items";

function interpolateTemplate(
    template: string,
    values: string[],
    bonus: string,
    color: string,
    variableColor: string
): ReactElement {
    const parts = template.split(/({{(\d+)}})/);

    return (
        <div className={`${color} break-keep wrap-anywhere`}>
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
            <span className="text-foreground">
                {/^[0-9]$/.test(bonus) ? ` (${bonus} Items)` : ` (${bonus})`}
            </span>
        </div>
    );
}

interface SetItemBonusAffix {
    affix: ItemProp;
    bonus: string;
    color: string;
    variableColor: string;
}

export default function SetItemBonusAffix({
    affix,
    bonus,
    color = "text-diablo-green",
    variableColor,
}: SetItemBonusAffix) {
    const template = affix[0];
    const values = affix.slice(1) || [];

    if (template === "") {
        return <div className="min-h-4" />;
    }

    return interpolateTemplate(template, values, bonus, color, variableColor);
}
