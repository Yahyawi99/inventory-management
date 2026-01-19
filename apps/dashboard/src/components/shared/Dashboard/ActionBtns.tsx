import { useTranslations } from "next-intl";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMoneyCheck,
  faArrowTrendDown,
  faFile,
} from "@fortawesome/free-solid-svg-icons";

type Btn = { icon: IconDefinition };
const btnsIcons: Btn[] = [
  {
    icon: faPlus,
  },
  {
    icon: faMoneyCheck,
  },
  {
    icon: faMoneyCheck,
  },
  {
    icon: faArrowTrendDown,
  },
  {
    icon: faFile,
  },
];

export default function Action() {
  const t = useTranslations("dashboard");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
        {btnsIcons.map((btn, i) => {
          return (
            <Btn key={i} btn={btn} label={t(`actions.action-${i + 1}.title`)} />
          );
        })}
      </div>
    </div>
  );
}

const Btn = ({ btn, label }: { btn: Btn; label: string }) => {
  return (
    <button className="min-w-[250px] max-w-full flex justify-center items-center gap-2 bg-(--sidebar) text-white py-[15px] cursor-pointer border-[2px] border-transparent rounded-(--radius) hover:bg-transparent hover:text-(--sidebar) hover:border-(--sidebar)">
      <FontAwesomeIcon icon={btn.icon} />
      <p className="pt-[5px]">{label}</p>
    </button>
  );
};
