function Arm1(props) {
  const { cheat } = props;
  const cheatHand =
    "M 134.4 52.5 l 19.3 -5.2 c 2.7 -0.7 5.4 0.9 6.3 2.7 c 0.7 2.7 -0.9 5.4 -2 5 L 146 59.7 m 14.8 16.8 l 21.2 -0.5 c 2.7 -0.7 5.4 0.9 6.1 3.5 c 0.7 2.7 -0.3 5.2 -3.5 6.1 l -18.6 -1.6 m -7 -16 l 24 1 c 2.7 -0.7 5.4 0.9 6.1 3.5 c 0.7 2.7 -0.9 5.4 -5.1 3.5 l -23 -0 m -15 -16 l 24.1 -11.4 c 2.7 -0.7 5.4 0.9 6.1 3.5 c 0.7 2.7 -0.9 5.4 -2.2 5.9 l -15 10";
  const normalHand =
    "M134.4 52.5l19.3-5.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1L146 59.7m14.8 16.8l19.4-5.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-18.3 4.9m-6.2-19l23.1-6.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-23.1 6.2m-10-18l26-7c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-21.3 5.7";
  return (
    <g {...props}>
      <g
        className="armL"
        data-svg-origin="1.2000000476837158 46.20000076293945"
        style={{
          WebkitTransformOrigin: 0,
          MsTransformOrigin: 0,
          transformOrigin: 0
        }}
      >
        <path
          fill="#ddf1fa"
          stroke="#3a5e77"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.5"
          d="M121.3 97.4L111 58.7l38.8-10.4 20 36.1z"
          transform="translate(-93 2)"
        ></path>
        <path
          fill="#ddf1fa"
          stroke="#3a5e77"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.5"
          d={cheat ? cheatHand : normalHand}
          transform="translate(-93 2)"
        ></path>
        {/* <path
          fill="#a9ddf3"
          d="M178.8 74.7l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zm1.3-10.7l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zm-4.6-9.1l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zm-23.4-5.5l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8z"
          transform="translate(-93 2)"
        ></path> */}
        <path
          fill="#fff"
          stroke="#3a5e77"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M123.5 96.8c-41.4 14.9-84.1 30.7-108.2 35.5L1.2 80c33.5-9.9 71.9-16.5 111.9-21.8"
          transform="translate(-93 2)"
        ></path>
        <path
          fill="#fff"
          stroke="#3a5e77"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M108.5 59.4c7.7-5.3 14.3-8.4 22.8-13.2-2.4 5.3-4.7 10.3-6.7 15.1 4.3.3 8.4.7 12.3 1.3-4.2 5-8.1 9.6-11.5 13.9 3.1 1.1 6 2.4 8.7 3.8-1.4 2.9-2.7 5.8-3.9 8.5 2.5 3.5 4.6 7.2 6.3 11-4.9-.8-9-.7-16.2-2.7m-25.8 5.7c-.6 4-3.8 8.9-9.4 14.7-2.6-1.8-5-3.7-7.2-5.7-2.5 4.1-6.6 8.8-12.2 14-1.9-2.2-3.4-4.5-4.5-6.9-4.4 3.3-9.5 6.9-15.4 10.8-.2-3.4.1-7.1 1.1-10.9m50.6-55.9c-1.7-2.4-5.9-4.1-12.4-5.2-.9 2.2-1.8 4.3-2.5 6.5-3.8-1.8-9.4-3.1-17-3.8.5 2.3 1.2 4.5 1.9 6.8-5-.6-11.2-.9-18.4-1 2 2.9.9 3.5 3.9 6.2"
          transform="translate(-93 2)"
        ></path>
      </g>
    </g>
  );
}

export default Arm1;
