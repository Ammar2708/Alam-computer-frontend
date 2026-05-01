import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-red-100 overflow-hidden">
      {/* Header with Alam Red Theme */}
      <div className="p-4 bg-red-600">
        <h2 className="text-lg font-black text-white uppercase tracking-wider text-center">
          Filter Products
        </h2>
      </div>

      <div className="p-5 space-y-6">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div className="space-y-3">
              {/* Section Title */}
              <h3 className="text-sm font-black text-gray-900 uppercase border-l-4 border-red-600 pl-2">
                {keyItem}
              </h3>

              <div className="grid gap-3 mt-4">
                {filterOptions[keyItem].map((option) => (
                  <Label 
                    key={option.id}
                    className="flex font-semibold items-center gap-3 cursor-pointer group hover:text-red-600 transition-colors"
                  >
                    <Checkbox
                      className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 transition-all"
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-red-600">
                      {option.label}
                    </span>
                  </Label>
                ))}
              </div>
            </div>
            
            {/* Red Tinted Separator */}
            <Separator className="bg-red-50" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;