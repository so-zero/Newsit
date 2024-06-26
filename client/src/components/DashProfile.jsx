import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import default_Img from "../assets/avatar.png";
import { Button, Modal, Alert, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import {
  updateSuccess,
  updateFailure,
  updateStart,
  deleteFailure,
  deleteStart,
  deleteSuccess,
} from "../redux/user/userSlice";
import { CiFaceFrown } from "react-icons/ci";
import { persistor } from "../redux/store";

export default function DashProfile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [isAvatarClick, setIsAvatarClick] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    setIsAvatarClick(false);
    const URL = `${import.meta.env.VITE_BACKEND_URL}/user/change-avatar`;
    try {
      const postData = new FormData();
      postData.set("avatar", avatar);
      const response = await axios.post(URL, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setAvatar(response?.data?.avatar);
    } catch (error) {
      console.log(error);
    }
  };

  const onErrorImg = (e) => {
    e.target.src = default_Img;
  };

  useEffect(() => {
    const getAvatar = async () => {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/user/${currentUser.id}`;
      const response = await axios.get(URL, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const { name, email, avatar } = response.data;
      setName(name);
      setEmail(email);
      setAvatar(avatar);
    };
    getAvatar();
  }, [currentUser.id, currentUser.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    const URL = `${import.meta.env.VITE_BACKEND_URL}/user/update-user`;

    try {
      const userData = new FormData();
      userData.set("name", name);
      userData.set("email", email);
      userData.set("currentPassword", currentPassword);
      userData.set("newPassword", newPassword);
      userData.set("newPassword2", newPassword2);

      const response = await axios.patch(URL, userData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      dispatch(updateSuccess(response.data));
    } catch (error) {
      dispatch(updateFailure(error.response.data.message));
    }
  };

  const handleDelete = async () => {
    setShowModal(false);
    const URL = `${import.meta.env.VITE_BACKEND_URL}/user/delete/${
      currentUser?.id
    }`;
    try {
      dispatch(deleteStart());
      const response = await axios.delete(URL, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      dispatch(deleteSuccess(response.data));
    } catch (error) {
      dispatch(deleteFailure(error.response.data.message));
    }
  };

  const purge = async () => {
    location.reload();
    await persistor.purge();
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full relative">
      <h1 className="my-7 text-center font-semibold text-xl">프로필</h1>
      {error && (
        <Alert className="mb-5" color="failure">
          {error}
        </Alert>
      )}
      <div className="relative">
        <div className="w-28 h-28 flex flex-col justify-center items-center mb-4 mx-auto">
          <img
            src={`${import.meta.env.VITE_ASSETS_URL}/uploads/${avatar} `}
            className="w-full h-full object-cover rounded-full overflow-hidden bg-white border-4 border-gray-400"
            onError={onErrorImg}
          />
          <input
            type="file"
            name="avatar"
            id="avatar"
            accept="png, jpg, jpeg"
            onChange={(e) => setAvatar(e.target.files[0])}
            hidden
          />
          <label
            htmlFor="avatar"
            onClick={() => setIsAvatarClick(true)}
            className="bg-black text-white w-fit mx-auto p-1 rounded-md text-sm absolute bottom-0 right-2/4 translate-x-2/4 cursor-pointer"
          >
            선택하기
          </label>
        </div>
        {isAvatarClick && (
          <button
            className="bg-black text-white w-fit mx-auto p-1 rounded-md text-sm absolute bottom-0 right-2/4 translate-x-2/4"
            onClick={handleClick}
          >
            변경하기
          </button>
        )}
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          name="name"
          placeholder="이름"
          color="base"
          value={currentUser.name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          type="text"
          name="email"
          placeholder="이메일"
          color="base"
          value={currentUser.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          type="password"
          name="currentPassword"
          placeholder="기존 비밀번호"
          color="base"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextInput
          type="password"
          name="NewPassword"
          placeholder="새로운 비밀번호"
          color="base"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextInput
          type="password"
          name="password2"
          placeholder="비밀번호 확인"
          color="base"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className=" bg-black text-white w-full py-3 rounded-md transition hover:-translate-y-2 hover:shadow-[5px_5px_0px_0px_rgba(100,100,100)]"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">로딩중...</span>
            </>
          ) : (
            "업데이트"
          )}
        </button>
        {currentUser.isAdmin && (
          <Link to="/create-post">
            <button
              type="button"
              className="bg-white text-black border border-black w-full py-3 rounded-md transition hover:bg-black hover:text-white"
            >
              News 작성하기
            </button>
          </Link>
        )}
      </form>
      <div className="text-gray-600  mt-5 flex justify-between">
        {currentUser.isAdmin || (
          <span
            className="cursor-pointer text-sm hover:text-red-600 transition"
            onClick={() => setShowModal(true)}
          >
            탈퇴하기
          </span>
        )}
        <span className="cursor-pointer text-sm" onClick={async () => purge()}>
          로그아웃
        </span>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <CiFaceFrown className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              계정을 삭제하시겠습니까?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                삭제하기
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                취소하기
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
