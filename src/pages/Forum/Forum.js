// Forum.js
import React from 'react';

export default function Forum() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 font-sans">
      {/* Header or banner */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Vertex Studio Forum</h2>
        
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="border border-gray-300 rounded-full py-2 px-4 outline-none"
            placeholder="Chats, messages and more"
          />
          <button className="bg-black text-white rounded-full px-4 py-2">
            New thread
          </button>
          <img
            src="profile.jpg"
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Prompt input */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-full py-3 px-4 placeholder-gray-500 outline-none"
          placeholder="Tell everyone what are you working on..."
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 w-[120px] text-center cursor-pointer">
          <span className="font-semibold">Crypto</span>
          <span className="text-sm text-gray-500">124 threads</span>
        </div>
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 w-[120px] text-center cursor-pointer">
          <span className="font-semibold">NFTs</span>
          <span className="text-sm text-gray-500">80 threads</span>
        </div>
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 w-[120px] text-center cursor-pointer">
          <span className="font-semibold">Finance</span>
          <span className="text-sm text-gray-500">24 threads</span>
        </div>
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 w-[120px] text-center cursor-pointer">
          <span className="font-semibold">Wall Street</span>
          <span className="text-sm text-gray-500">22 threads</span>
        </div>
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 w-[120px] text-center cursor-pointer">
          <span className="font-semibold">Houses</span>
          <span className="text-sm text-gray-500">67 threads</span>
        </div>
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 w-[120px] text-center cursor-pointer">
          <span className="font-semibold">Trading</span>
          <span className="text-sm text-gray-500">48 threads</span>
        </div>
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 w-[120px] text-center cursor-pointer">
          <span className="font-semibold">Sport Cars</span>
          <span className="text-sm text-gray-500">16 threads</span>
        </div>
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 w-[120px] text-center cursor-pointer">
          <span className="font-semibold">All categories</span>
          <span className="text-sm text-gray-500">12 more</span>
        </div>
      </div>

      {/* Popular threads */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Popular threads</h3>
        
        {/* Thread item */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="elon.jpg"
              alt="Elon"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex flex-col text-sm">
              <strong>Elon Musk</strong>
              <span className="text-gray-500">Today, 4:45 PM</span>
            </div>
          </div>
          <p className="text-sm mb-2">
            Shiba Inu to the moon 🚀🌖
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span>❤️ 954 likes</span>
            <span>💬 115 replies</span>
          </div>
          <button className="bg-gray-100 border border-gray-300 text-sm rounded-md px-3 py-1">
            Reply
          </button>

          {/* Nested reply */}
          <div className="ml-10 mt-4 border-l-2 border-gray-100 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <img
                src="andrew.jpg"
                alt="Andrew"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col text-sm">
                <strong>Andrew Tate</strong>
                <span className="text-gray-500">Today, 4:45 PM</span>
              </div>
            </div>
            <p className="text-sm mb-2">That’s right my friend</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span>❤️ 42 likes</span>
              <span>💬 12 replies</span>
            </div>
            <button className="bg-gray-100 border border-gray-300 text-sm rounded-md px-3 py-1">
              Reply
            </button>
          </div>

          <button className="mt-3 text-blue-600 text-sm">
            See other 105 replies
          </button>
        </div>

        <h4 className="text-sm font-semibold text-gray-600">
          Yesterday, 07 May
        </h4>

        {/* Another thread */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="morpheus.jpg"
              alt="Morpheus"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex flex-col text-sm">
              <strong>Morpheus</strong>
              <span className="text-gray-500">Yesterday, 1:13 PM</span>
            </div>
          </div>
          <p className="text-sm mb-2">
            Can someone explain to me what crypto and NFTs are? ...
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span>❤️ 954 likes</span>
            <span>💬 115 replies</span>
          </div>
          <button className="bg-gray-100 border border-gray-300 text-sm rounded-md px-3 py-1">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
