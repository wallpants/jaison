import { customType } from "drizzle-orm/pg-core";

// https://github.com/drizzle-team/drizzle-orm/pull/1785
// eslint-disable-next-line
const jsonb = customType<{ data: any }>({
   dataType() {
      return "jsonb";
   },
   toDriver(val) {
      // eslint-disable-next-line
      return val as any;
   },
   fromDriver(value) {
      if (typeof value === "string") {
         try {
            // eslint-disable-next-line
            return JSON.parse(value) as any;
         } catch (err) {
            console.error("error in jsonb customType: ", err);
         }
      }
      // eslint-disable-next-line
      return value as any;
   },
});

export default jsonb;
