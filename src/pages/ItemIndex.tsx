import HeadingSeparator from "@/components/HeadingSeparator";

const ItemIndex = () => {
    return (
        <div className="pt-4 grid gap-4 grid-cols-1">
            <HeadingSeparator>Armor</HeadingSeparator>
            <HeadingSeparator>Weapons</HeadingSeparator>
            <HeadingSeparator>Rings</HeadingSeparator>
            <HeadingSeparator>Amulets</HeadingSeparator>
            <HeadingSeparator>Charms</HeadingSeparator>
            <HeadingSeparator>Jewels</HeadingSeparator>
        </div>
    );
};

export default ItemIndex;
