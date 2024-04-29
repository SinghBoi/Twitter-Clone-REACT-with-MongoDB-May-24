import { useState, useEffect } from "react";

function Image() {
  const [img, setImg] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const resp = await fetch("https://dog.ceo/api/breeds/image/random");

      const user = await resp.json();
      setImg(user.message);
    };
    fetchUser();
  }, []);

  return (
    <div>
      <img src={img} alt="" width="100px" height="80px" />
    </div>
  );
}
export default Image;