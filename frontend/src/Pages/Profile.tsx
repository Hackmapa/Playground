import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import defaultBannerImage from '../assets/banner-image.png'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface CircularProgressBarProps {
  percentage: number;
  label: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ percentage, label }) => {
  const radius = 40; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center w-1/4 p-4">
      <svg width="100" height="100" className="mb-2">
        <circle
          stroke="#D1D5DB" 
          fill="transparent"
          strokeWidth="10"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          stroke="#8B5CF6" 
          fill="transparent"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx="50"
          cy="50"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#8B5CF6"
          fontSize="16px"
          fontWeight="bold"
        >
          {percentage}%
        </text>
      </svg>
      <p>{label}</p>
    </div>
  );
};

const options: ApexOptions = {
  chart: {
    type: 'area',
    toolbar: {
      show: false
    },
    background: 'transparent'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    labels: {
      style: {
        colors: ['#ffffff'], 
      }
    }
  },
  yaxis: {
    max: 100,
    labels: {
      style: {
        colors: ['#ffffff'], 
      }
    }
  },
  fill: {
    opacity: 0.8
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'dark',
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right', 
    fontSize: '16px', 
    labels: {
      colors: 'white',  
    },
    markers: {
      width: 50, 
      height: 15, 
      radius: 0, 
      offsetX: -5 
    },
    itemMargin: {
      horizontal: 20, 
    }
  },
  colors: ['#4CAF50', '#FF5733']
};

const series = [
  {
    name: 'Win',
    data: [50, 60, 70, 100, 50, 20, 80, 90, 60, 50]
  },
  {
    name: 'Lose',
    data: [40, 50, 55, 30, 80, 60, 20, 30, 40, 70]
  }
];


const Profile = () => {
  // const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    password: '',
    bannerImage: defaultBannerImage,
    description: user.description
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const friends = [
    { name: 'HECATE', level: 27, avatar: defaultBannerImage, status: 'online', bg: defaultBannerImage },
    { name: 'HECATE', level: 8, avatar: defaultBannerImage, status: 'online', bg: defaultBannerImage },
    { name: 'HECATE', level: 17, avatar: defaultBannerImage, status: 'offline', bg: defaultBannerImage },
    { name: 'HECATE', level: 5, avatar: defaultBannerImage, status: 'offline', bg: defaultBannerImage },
    { name: 'HECATE', level: 23, avatar: defaultBannerImage, status: 'offline', bg: defaultBannerImage },
  ];

  useEffect(() => {
    document.title = 'Hackmapa - Profile';
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData({
            ...formData,
            bannerImage: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleEditSave = () => {
    if (editMode) {
      // Save the changes (you may need to dispatch an action to save changes to the store)
      // dispatch(updateUserProfile(formData)); // Example action
    }
    setEditMode(!editMode);
  };

  const data = [
    { percentage: 66, label: 'TRYHARDER' },
    { percentage: 41, label: 'COOKER' },
    { percentage: 85, label: 'EXPLORER' },
    { percentage: 78, label: 'PILOT' },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      {/* Top Section */}
      <div className="flex">
        <div className="relative w-2/3">
          <img
            src={defaultBannerImage}
            alt="Profile"
            className="h-full w-full object-cover rounded-lg"
          />
        </div>
        <div className="w-1/3 p-4 flex flex-col">
          <div style={{ backgroundColor: '#271D34' }} className=" p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Level 29</h1>
              <span className="text-sm">2378 / 4000</span>
            </div>
            <div className="relative pt-4">
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-purple-200">

      <div
        style={{
          width: '59%',
          animation: 'glow 1s ease-in-out infinite alternate',
          background: 'linear-gradient(90deg, #D766FF, #E59CFF)',
          borderRadius: 'inherit',
          border: '1px solid #D766FF',
        }}
        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center border-2 border-purple-500"
      ></div>
    </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Next Level</span>
                <span className="text-sm">Level 30</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#271D34' }} className=" p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={formData.bannerImage}
                  alt="Profile"
                  className="rounded-full h-20 w-20 object-cover"
                />
                <div className="ml-4">
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="bg-gray-700 p-2 rounded"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold">{formData.username}</h2>
                  )}
                </div>
              </div>
              <button onClick={handleEditSave} className={`px-4 py-2 rounded ${editMode ? 'bg-green-600' : 'bg-red-600'}`}>
                {editMode ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="flex">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-left">USERNAME</h2>
                {editMode ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-gray-700 p-2 rounded w-full"
                  />
                ) : (
                  <p className="text-left">{formData.username}</p>
                )}
                <h2 className="text-xl font-semibold mt-2 text-left">EMAIL</h2>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-700 p-2 rounded w-full"
                  />
                ) : (
                  <p className="text-left">{formData.email}</p>
                )}
                <h2 className="text-xl font-semibold mt-2 text-left">PASSWORD</h2>
                <div className="relative w-full">
                  {editMode ? (
                    <div className="flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-gray-700 p-2 rounded w-full pr-10"
                        placeholder="************"
                      />
                      <span
                        className="absolute right-2 cursor-pointer"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  ) : (
                    <p className="text-left">{"*".repeat(formData.password.length)}</p>
                  )}
                </div>
              </div>
              <div className="ml-4 flex flex-col justify-start">
                <h2 className="text-xl font-semibold text-left">BANNER IMAGE</h2>
                {editMode ? (
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="bg-gray-700 p-2 rounded mt-2"
                  />
                ) : (
                  <img
                    src={formData.bannerImage}
                    alt="Banner"
                    className="h-20 w-20 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-left">DESCRIPTION</h2>
              {editMode ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-gray-700 p-2 rounded w-full"
                />
              ) : (
                <p className="text-left">{formData.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex mt-4">
        {/* Left Cards */}
        <div className="w-2/3 p-2">
          <div className="flex space-x-4">
            <div className="relative  rounded-lg w-1/3 overflow-hidden" style={{ height: '200px', backgroundColor: '#271D34' }}>
              <img
                src={defaultBannerImage}
                alt="Tic Tac Toe"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div>
                  <p className="text-sm text-white text-left w-3/4 font-semibold">You have played this game 102 times</p>
                  <div className="absolute top-4 right-4  text-white rounded-full h-8 w-8 flex items-center justify-center" style={{ backgroundColor: '#FD9E96' }}>27</div>
                </div>
                <div className="flex justify-end">
                  <button className=" px-6 py-1 rounded-full text-white" style={{ backgroundColor: '#FD9E96' }}>Play</button>
                </div>
                <div className="absolute bottom-6 left-4 text-white text-sm">Tic Tac Toe</div>
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute border-t-4 border-l-4  top-0 left-0 w-full h-full" style={{ width: 'calc(100% - 200px)', height: '70px', borderColor: '#FD9E96' }}></div>
                <div className="absolute border-b-4 border-r-4  bottom-0 right-0 w-full h-full" style={{ width: '130px', height: 'calc(100% - 130px)', borderColor: '#FD9E96' }}></div>
              </div>
            </div>

            <div className="relative  rounded-lg w-1/3 overflow-hidden" style={{ height: '200px', backgroundColor: '#271D34' }}>
              <img
                src={defaultBannerImage}
                alt="Neon Snake"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div>
                  <p className="text-sm text-white text-left w-3/4 font-semibold">You're better than 85% of the players!</p>
                  <div className="absolute top-4 right-4  text-white rounded-full h-8 w-8 flex items-center justify-center" style={{ backgroundColor: '#91C1F9' }}>38</div>
                </div>
                <div className="flex justify-end">
                  <button className=" px-6 py-1 rounded-full text-white" style={{ backgroundColor: '#91C1F9' }}>Play</button>
                </div>
                <div className="absolute bottom-6 left-4 text-white text-sm">Neon Snake</div>
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute border-t-4 border-l-4  top-0 left-0 w-full h-full" style={{ width: 'calc(100% - 200px)', height: '70px', borderColor: '#91C1F9' }}></div>
                <div className="absolute border-b-4 border-r-4  bottom-0 right-0 w-full h-full" style={{ width: '130px', height: 'calc(100% - 130px)', borderColor: '#91C1F9'}}></div>
              </div>
            </div>

            <div className="relative  rounded-lg w-1/3 overflow-hidden" style={{ height: '200px', backgroundColor: '#271D34' }}>
              <img
                src={defaultBannerImage}
                alt="Rock Paper Scissors"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div>
                  <p className="text-sm text-white text-left w-3/4 font-semibold">You have 23/27 successes on this game</p>
                  <div className="absolute top-4 right-4 text-white rounded-full h-8 w-8 flex items-center justify-center" style={{ backgroundColor: '#FF8BC3' }}>23</div>
                </div>
                <div className="flex justify-end">
                  <button className=" px-6 py-1 rounded-full text-white" style={{ backgroundColor: '#FF8BC3' }}>Play</button>
                </div>
                <div className="absolute bottom-6 left-4 text-white text-sm">Rock Paper Scissors</div>
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute border-t-4 border-l-4  top-0 left-0 w-full h-full" style={{ width: 'calc(100% - 200px)', height: '70px', borderColor: '#FF8BC3' }}></div>
                <div className="absolute border-b-4 border-r-4  bottom-0 right-0 w-full h-full" style={{ width: '130px', height: 'calc(100% - 130px)', borderColor: '#FF8BC3' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Circular Progress Bars */}
        <div style={{ backgroundColor: '#271D34' }} className="w-1/3 p-4 m-4  rounded-lg">
          <div className="flex justify-between">
            {data.map((item, index) => (
              <CircularProgressBar
                key={index}
                percentage={item.percentage}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-4 flex">
        {/* Game History */}
<div className="w-1/2 p-2">
  <div style={{ backgroundColor: '#271D34' }} className=" p-4 rounded-lg">
    <h2 className="text-xl font-semibold mb-4">GAME HISTORY</h2>
    <table className="min-w-full mt-2">
      <thead>
        <tr style={{ backgroundColor: '#1A1423' }}>
          <th className="text-left p-2 rounded-l-lg">Game</th>
          <th className="text-left p-2">Rating</th>
          <th className="text-left p-2">Points</th>
          <th className="text-left p-2 rounded-r-lg">Time</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ backgroundColor: '#2F223F' }}>
          <td className="p-2 rounded-l-lg">
            <div className="flex items-center">
              <img src={defaultBannerImage} alt="Tic Tac Toe" className="h-6 w-6 mr-2"/>
              <span>Tic Tac Toe</span>
            </div>
            
          </td>
          <td className="p-2">
            <div className="flex items-center">
            <div className="text-sm flex-col flex text-left">
              1,252 <span className="text-purple-500">Top 37%</span>
            </div>
            </div>
          </td>
          <td className="p-2">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">10</span>
              <span className="text-green-500">&#9650;</span>
            </div>
          </td>
          <td className="p-2 text-left rounded-r-lg">3:30</td>
        </tr>
        <tr style={{ backgroundColor: '#271D34' }} className="">
          <td className="p-2 rounded-l-lg">
            <div className="flex items-center">
              <img src={defaultBannerImage} alt="Neon Snake" className="h-6 w-6 mr-2"/>
              <span>Neon Snake</span>
            </div>
          </td>
          <td className="p-2">
          <div className="flex items-center">
            <div className="text-sm flex-col flex text-left">
              1,252 <span className="text-purple-500">Top 37%</span>
            </div>
            </div>
          </td>
          <td className="p-2">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">9</span>
              <span className="text-red-500">&#9660;</span>
            </div>
          </td>
          <td className="p-2 text-left rounded-r-lg">13:45</td>
        </tr>
        <tr style={{ backgroundColor: '#2F223F' }}>
          <td className="p-2 rounded-l-lg">
            <div className="flex items-center">
              <img src={defaultBannerImage} alt="Tic Tac Toe" className="h-6 w-6 mr-2"/>
              <span>Tic Tac Toe</span>
            </div>
            
          </td>
          <td className="p-2">
            <div className="flex items-center">
            <div className="text-sm flex-col flex text-left">
              1,252 <span className="text-purple-500">Top 37%</span>
            </div>
            </div>
          </td>
          <td className="p-2">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">10</span>
              <span className="text-green-500">&#9650;</span>
            </div>
          </td>
          <td className="p-2 text-left rounded-r-lg">3:30</td>
        </tr>
        <tr style={{ backgroundColor: '#271D34' }} className="">
          <td className="p-2 rounded-l-lg">
            <div className="flex items-center">
              <img src={defaultBannerImage} alt="Neon Snake" className="h-6 w-6 mr-2"/>
              <span>Neon Snake</span>
            </div>
          </td>
          <td className="p-2">
          <div className="flex items-center">
            <div className="text-sm flex-col flex text-left">
              1,252 <span className="text-purple-500">Top 37%</span>
            </div>
            </div>
          </td>
          <td className="p-2">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">9</span>
              <span className="text-red-500">&#9660;</span>
            </div>
          </td>
          <td className="p-2 text-left rounded-r-lg">13:45</td>
        </tr>
        <tr style={{ backgroundColor: '#2F223F' }}>
          <td className="p-2 rounded-l-lg">
            <div className="flex items-center">
              <img src={defaultBannerImage} alt="Tic Tac Toe" className="h-6 w-6 mr-2"/>
              <span>Tic Tac Toe</span>
            </div>
            
          </td>
          <td className="p-2">
            <div className="flex items-center">
            <div className="text-sm flex-col flex text-left">
              1,252 <span className="text-purple-500">Top 37%</span>
            </div>
            </div>
          </td>
          <td className="p-2">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">10</span>
              <span className="text-green-500">&#9650;</span>
            </div>
          </td>
          <td className="p-2 text-left rounded-r-lg">3:30</td>
        </tr>
        <tr style={{ backgroundColor: '#271D34' }} className="">
          <td className="p-2 rounded-l-lg">
            <div className="flex items-center">
              <img src={defaultBannerImage} alt="Neon Snake" className="h-6 w-6 mr-2"/>
              <span>Neon Snake</span>
            </div>
          </td>
          <td className="p-2">
          <div className="flex items-center">
            <div className="text-sm flex-col flex text-left">
              1,252 <span className="text-purple-500">Top 37%</span>
            </div>
            </div>
          </td>
          <td className="p-2">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">9</span>
              <span className="text-red-500">&#9660;</span>
            </div>
          </td>
          <td className="p-2 text-left rounded-r-lg">13:45</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


<div className="w-1/2 p-2">
      <div style={{ backgroundColor: '#271D34' }} className=" p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-2">FRIENDS</h2>
        <ul className="mt-4">
          {friends.map((friend, index) => (
            <li
              key={index}
              className="relative flex items-center justify-between mt-2.5 p-2 border-2 border-purple-500"
              style={{
                backgroundImage: `url(${friend.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderTopLeftRadius: '9999px', 
                borderBottomLeftRadius: '9999px', 
                borderTopRightRadius: '6000px',
                borderBottomRightRadius: '6000px',
              }}
            >
              <div
                className="absolute -top-1 -right-1 z-10 w-4 h-4 rounded-full"
                style={{ backgroundColor: friend.status === 'online' ? 'lightgreen' : 'gray' }}
              ></div>
              <div className="flex items-center w-12 h-12 z-10">
                <img src={friend.avatar} alt={`${friend.name} avatar`} className="absolute -left-1 w-16 h-16 rounded-full" />
                <span className="ml-16 text-white">{friend.name}</span>
              </div>
              <div className="flex items-center z-10">
                <span className="text-white mr-2">LEVEL {friend.level}</span>
              </div>
              <div className="absolute inset-0 bg-black opacity-50" style={{
                borderTopLeftRadius: '9999px', 
                borderBottomLeftRadius: '9999px', 
                borderTopRightRadius: '6000px',
                borderBottomRightRadius: '6000px', 
              }}></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
      </div>

      {/* Graph Section */}
      <div style={{ backgroundColor: '#271D34' }} className=" p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-white">GAMES OVER THE PAST 10 MONTHS</h2>
      <div className="mt-2">
        <Chart options={options} series={series} type="area" height={350} />
      </div>
    </div>
    </div>
  );
};

export default Profile;
