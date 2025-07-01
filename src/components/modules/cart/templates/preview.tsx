"use client";

import { type HttpTypes } from "@medusajs/types";
import { clx, Table } from "@medusajs/ui";

import repeat from "@/lib/medusa/util/repeat";
import Item from "@/components/modules/cart/components/item";
import SkeletonLineItem from "@/components/modules/skeletons/components/skeleton-line-item";

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart;
};

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items;
  const hasOverflow = items && items.length > 4;

  // Separate items into autoship and one-time
  const autoshipItems = items?.filter(item => item.metadata?.autoship) || [];
  const oneTimeItems = items?.filter(item => !item.metadata?.autoship) || [];

  const renderItems = (itemList: any[], title: string) => {
    if (itemList.length === 0) return null;
    
    return (
      <div className="mb-4">
        <div className="px-2 py-1 mb-2 text-sm font-medium text-ui-fg-muted border-b border-ui-border-base">
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
                    type="preview"
                    currencyCode={cart.currency_code}
                  />
                );
              })}
          </Table.Body>
        </Table>
      </div>
    );
  };

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      {items ? (
        <>
          {renderItems(oneTimeItems, "One-time Purchase")}
          {renderItems(autoshipItems, "Subscription Items")}
        </>
      ) : (
        <Table>
          <Table.Body data-testid="items-table">
            {repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />;
            })}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default ItemsPreviewTemplate;
