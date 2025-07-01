import { type HttpTypes } from "@medusajs/types";
import { Table } from "@medusajs/ui";

import repeat from "@/lib/medusa/util/repeat";
import Divider from "@/components/modules/common/components/divider";
import Item from "@/components/modules/order/components/item";
import SkeletonLineItem from "@/components/modules/skeletons/components/skeleton-line-item";

type ItemsProps = {
  order: HttpTypes.StoreOrder;
};

const Items = ({ order }: ItemsProps) => {
  const items = order.items;

  // Separate items into autoship and one-time
  const autoshipItems = items?.filter(item => item.metadata?.autoship) || [];
  const oneTimeItems = items?.filter(item => !item.metadata?.autoship) || [];

  const renderItems = (itemList: (HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem)[], title: string) => {
    if (itemList.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="px-2 py-2 mb-3 text-sm font-medium text-ui-fg-muted border-b border-ui-border-base">
          {title}
        </div>
        <Table>
          <Table.Body>
            {itemList
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1;
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={order.currency_code}
                  />
                );
              })}
          </Table.Body>
        </Table>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <Divider className="!mb-0" />
      {items?.length ? (
        <>
          {renderItems(oneTimeItems, "One-time Purchase")}
          {renderItems(autoshipItems, "Subscription Items")}
        </>
      ) : (
        <Table>
          <Table.Body data-testid="products-table">
            {repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />;
            })}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default Items;
