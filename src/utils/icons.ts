import {
  FIconDoneFill,
  FIconAdd,
  FIconArrowRight4P,
  FIconChevronRight4P,
  FIconTime4P,
  FIconCrowd4P,
} from "@foxone/icons";

const ficons = {
  FIconDoneFill: { component: FIconDoneFill },
  FIconAdd: { component: FIconAdd },
  FIconArrowRight4P: { component: FIconArrowRight4P },
  FIconChevronRight4P: { component: FIconChevronRight4P },
  FIconTime4P: { component: FIconTime4P },
  FIconCrowd4P: { component: FIconCrowd4P },
};

import {
  mdiArrowUpCircle,
  mdiArrowDownCircle,
  mdiCog,
  mdiMagnify,
  mdiContentCopy,
  mdiWallet,
} from "@mdi/js";

const mdiIcons = {
  mdiArrowUpCircle,
  mdiArrowDownCircle,
  mdiCog,
  mdiMagnify,
  mdiContentCopy,
  mdiWallet,
};

export default {
  ...ficons,
  ...mdiIcons,
};
