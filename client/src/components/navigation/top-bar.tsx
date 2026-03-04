import { useSelector } from "react-redux";
import { checkIsAuth } from "@/redux/features/auth/authSlice";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { Check } from "lucide-react";

export const TopBar = () => {
  const isAuth = useSelector(checkIsAuth);
  const [copied, setCopied] = useState(false);

  const handleCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toast.success("Link copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        toast.error("Failed to copy the link: " + err);
      });
  };

  const { user } = useAppSelector((state) => state.auth);
  if (!user) return null;
  const userAffiliateId = user.affiliateId;
  const refLink = `https://jinn-travel.com/?affiliateId=${userAffiliateId}`;

  return (
    <div>
      {isAuth && (
        <div className="inline-flex w-full h-16 md:grid grid-cols-4 lg:grid-cols-3 2xl:flex justify-between items-center">
          <div className="flex flex-col items-start justify-between rounded-xl mr-4 flex-grow col-span-2 lg:col-span-2 2xl:w-[755px]">
            <Label className="relative w-full">
              <span className="absolute z-10 inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                <InsertLinkRoundedIcon className="text-muted-foreground" />
              </span>
              <button
                aria-label="Copy link"
                onClick={() => handleCopy(refLink)}
                className="absolute z-10 inset-y-0 right-0 flex items-center px-4"
              >
                {!copied ? (
                  <ContentCopyRoundedIcon className="transition-color duration-300 hover:bg-accent rounded-md p-0.5 text-muted-foreground hover:text-foreground" />
                ) : (
                  <Check className="p-0.5 text-foreground" />
                )}
              </button>
              <Input
                value={refLink}
                type="text"
                name="referral link"
                readOnly
                className="py-2 pl-12 pr-12 sm:text-sm text-muted-foreground transition-colors duration-300"
              />
            </Label>
          </div>
          <div className="flex col-span-2 lg:col-span-1 justify-end items-center">
            <div className="flex items-center justify-between gap-x-4">
              <span className="inset-y-0 left-0 flex items-center md:pr-8 mx-4 md:border-r-2 border-r-border">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-foreground"
                >
                  <path
                    d="M8.5 9.34142C8.5 8.23327 7.02611 7.93954 6.63508 8.97641C5.6892 11.4845 5 13.7283 5 14.9413C5 18.8073 8.13401 21.9413 12 21.9413C15.866 21.9413 19 18.8073 19 14.9413C19 13.638 18.2045 11.1451 17.1498 8.41279C15.7836 4.87332 15.1005 3.10358 14.2573 3.00826C13.9874 2.97776 13.6931 3.0326 13.4523 3.15822C12.7 3.55079 12.7 5.481 12.7 9.34142C12.7 10.5012 11.7598 11.4414 10.6 11.4414C9.4402 11.4414 8.5 10.5012 8.5 9.34142Z"
                    stroke="currentColor"
                    strokeOpacity="0.50"
                  />
                  <g className="text-destructive">
                    <path
                      d="M5 15C5 18.866 8.13401 22 12 22C15.866 22 19 18.866 19 15"
                      stroke="currentColor"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </span>
              <div className="max-md:hidden">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
