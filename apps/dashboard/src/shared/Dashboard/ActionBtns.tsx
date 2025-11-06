import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMoneyCheck,
  faArrowTrendDown,
  faFile,
} from "@fortawesome/free-solid-svg-icons";

type Btn = { label: string; icon: IconDefinition };
const btnsData: Btn[] = [
  {
    label: "Add New Product",
    icon: faPlus,
  },
  {
    label: "Create Sales Order",
    icon: faMoneyCheck,
  },
  {
    label: "Create Purchase Order",
    icon: faMoneyCheck,
  },
  {
    label: "View Low Stock",
    icon: faArrowTrendDown,
  },
  {
    label: "Generate Report",
    icon: faFile,
  },
];

export default function Action() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
        {btnsData.map((btn, i) => {
          return <Btn key={i} data={btn} />;
        })}
      </div>
    </div>
  );
}

const Btn = ({ data }: { data: Btn }) => {
  return (
    <button className="min-w-[250px] max-w-full flex justify-center items-center gap-2 bg-(--sidebar) text-white py-[15px] cursor-pointer border-[2px] border-transparent rounded-(--radius) hover:bg-transparent hover:text-(--sidebar) hover:border-(--sidebar)">
      <FontAwesomeIcon icon={data.icon} />
      <p className="pt-[5px]">{data.label}</p>
    </button>
  );
};
