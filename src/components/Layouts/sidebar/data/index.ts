
import * as Icons from "../icons";


export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Overview",
        icon: Icons.HomeIcon,
        url: "/",
      
      },
      {
        title: "Users ",
        url: "/dashboard/users",
        icon: Icons.People,
        items: [],
      },
      {
        title: "Moderation",
        url: "/dashboard/moderation",
        icon: Icons.User,
        items: [],
      },
        {
          title: "Explore",
          url: "/dashboard/explore",
          icon: Icons.Explore,
        },
        {
          title: "Analytics",
        icon: Icons.Analytics,
        url: "/dashboard/Analytic",
      
      },
     
      {
        title: "Setting",
        icon: Icons.Settings,
        url: "/dashboard/profile",
      },
    ],
  },
 
];
