import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { getMe, registerUser } from "../redux/features/auth/authSlice";
import { CropAvatar } from "../components/Avatar";
import avatarLogo from "../assets/avatar.webp";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import PartyModeOutlinedIcon from "@mui/icons-material/PartyModeOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";

export const Settings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const avatar = currentUser.avatarUrl
    ? `${import.meta.env.VITE_API_URL}${currentUser.avatarUrl}`
    : avatarLogo;

  const { status } = useSelector((state) => state.auth);
  const loading = status === "loading";
  // const [loading, setLoading] = useState(false)
  // const handleClick = () => {
  //   setLoading(true)
  // }
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await dispatch(
        registerUser({
          email,
          username: email,
          phone,
          first_name,
          last_name,
          password,
        })
      );
      await dispatch(getMe());
      setEmail("");
      setPhone("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleCopy = (id) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy the link: " + err);
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUpdateKey((prev) => prev + 1);
  };

  const userEmail = currentUser.email;
  const userPhone = currentUser.phone;
  const userFirstName = currentUser.first_name;
  const userLastName = currentUser.last_name;
  const userLevel = currentUser.level;
  const userAffiliateId = currentUser.affiliate_id;
  const refLink = `https://jinn-travel.com/?affiliateId=${userAffiliateId}`;

  return (
    <div key={updateKey} className="flex flex-col flex-1 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 border-box">
        <div className="flex flex-col max-md:order-1 justify-between rounded-2xl px-4 py-6 bg-white dark:bg-secondary backdrop-blur-sm">
          <div className="col-span-full mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl w-content">Profile</h1>
              <Link to="/settings/account">
                <Button variant="outline" size="sm">
                  Account Settings
                </Button>
              </Link>
              <Link to="/admin/settings/level-settings">
                <Button variant="outline" size="sm">
                  Level Settings
                </Button>
              </Link>
            </div>
          </div>
          <span className="text-accentBlue">Your referral link:</span>
          <div className="flex flex-col items-start justify-between rounded-xl">
            <label className="relative w-full">
              <span className="absolute z-10 inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                <InsertLinkRoundedIcon className="text-accentBlue" />
              </span>
              <button
                aria-label="Copy link"
                onClick={() => handleCopy(refLink)}
                className="absolute z-10 inset-y-0 right-0 flex items-center px-4"
              >
                <ContentCopyRoundedIcon className="transition-all duration-300 hover:text-accentBlue" />
              </button>
              <input
                value={refLink}
                type="text"
                name="referral link"
                readOnly
                className="
                  text-gray-800 dark:text-slate-200
                  block bg-primaryLite dark:bg-primary outline-none
                  w-full shadow-inset-2 rounded-xl
                  py-2 pl-12 pr-12 sm:text-sm"
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl lg:w-72 px-4 py-6 bg-white dark:bg-secondary backdrop-blur-sm">
          <div className="flex flex-col items-center justify-around w-full px-4 h-40 text-2xl rounded-xl">
            <div className="relative">
              <img
                className="w-20 h-20 rounded-full shadow-inset-custom"
                src={avatar}
                alt="Avatar"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2"
              >
                <PartyModeOutlinedIcon
                  onClose={handleCloseModal}
                  className="bg-primaryLite dark:bg-primary text-gray-800 dark:text-gray-200 border-dashed border-2 border-gray-800 dark:border-gray-200 shadow-custom"
                  style={{
                    borderRadius: "50%",
                    fontSize: "2rem",
                    padding: "4px",
                  }}
                />
              </button>
            </div>
            <span
              className={`py-2 px-8 rounded-xl uppercase
                        ${
                          userLevel === "Bronze"
                            ? "bg-gradient-bronze border-[1px] border-solid border-bronze-border text-bronze-text [text-shadow:0_2px_1px_rgba(205,_127,_50,_1)]"
                            : userLevel === "Silver"
                            ? "bg-gradient-silver border-[1px] border-solid border-silver-border text-gray-700 [text-shadow:0_2px_1px_rgba(187,_187,_187,_1)]"
                            : userLevel === "Gold"
                            ? "bg-gradient-gold border-[1px] border-solid border-gold-border text-gold-text [text-shadow:0_2px_1px_rgba(180,_126,_17,_1)]"
                            : "bg-none"
                        }`}
            >
              <b>{userLevel}</b>
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full bg-white dark:bg-secondary backdrop-blur-sm rounded-2xl px-4 py-6 gap-y-4 items-start justify-between">
        <h2 className="text-2xl">Personal Information</h2>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-20 w-full"
        >
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={userEmail}
                // onChange={(e) => setEmail(e.target.value)}
                readOnly
                autoComplete="email"
                className="block w-full rounded-xl shadow-inset-2 outline-none focus:outline-none active:outline-none bg-primaryLite dark:bg-primary px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm/6 font-medium">
              Phone Number
            </label>
            <div className="mt-2">
              <input
                id="phone"
                name="phone"
                type="phone"
                placeholder={userPhone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                readOnly
                autoComplete="phone"
                className="block w-full rounded-xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="first-name" className="block text-sm/6 font-medium">
              First Name
            </label>
            <div className="mt-2">
              <input
                id="first-name"
                name="first-name"
                type="text"
                placeholder={userFirstName}
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                readOnly
                autoComplete="given-name"
                className="block w-full rounded-xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="last-name" className="block text-sm/6 font-medium">
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="last-name"
                name="last-name"
                type="text"
                placeholder={userLastName}
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                readOnly
                autoComplete="family-name"
                className="block w-full rounded-xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                readOnly
                placeholder="*********"
                autoComplete="current-password"
                className="block w-full rounded-xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirm-password"
                className="block text-sm/6 font-medium"
              >
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                readOnly
                placeholder="*********"
                autoComplete="current-password"
                className="block w-full rounded-xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400  sm:text-sm"
              />
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              // onClick={handleClick}
              // disabled={loading}
              disabled
              className="
                  w-full md:w-1/4 rounded-lg bg-primaryLite dark:bg-primary text-gray-800 dark:text-gray-300 
                  mt-6 px-4 py-1.5 text-lg font-semibold text-center hover:text-black dark:hover:text-white
                  hover:scale-105 active:scale-100 active:shadow-inset-2 transition-all duration-300
                  disabled:scale-100 disabled:shadow-inset-2 disabled:text-gray-300 disabled:animate-pulse disabled:cursor-progress"
            >
              {loading ? (
                <>
                  <span role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#4f7c82"
                      />
                    </svg>
                    Loading...
                  </span>
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <CropAvatar isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};
