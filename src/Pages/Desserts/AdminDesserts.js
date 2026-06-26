import React, { useState, useEffect } from "react";
import {
  getDesserts,
  createDessert,
  deleteDessert,
  editDessert,
} from "../../APIFunctions/Desserts";
import { useSCE } from "../../Components/context/SceContext";

export default function DessertPage() {
  const [desserts, setDesserts] = useState([]);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [rating, setRating] = useState();
  const { user } = useSCE();
  const [editingId, setEditingId] = useState(null);
  const [editedDessert, setEditedDessert] = useState({
    title: "",
    description: "",
    rating: "",
  });

  async function getDessertsFromDB() {
    const dessertsFromDB = await getDesserts();
    if (!dessertsFromDB.error) {
      setDesserts(dessertsFromDB.responseData);
    }
  }

  useEffect(() => {
    getDessertsFromDB();
  }, []);

  const INPUT_CLASS =
    "indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white";
  return (
    <div className="m-10">
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Welcome to the Admin Dessert Page!!
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-full sm:grid-cols-6">
        <div className="col-span-full sm:col-span-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium leading-6 text-gray-300"
          >
            Dessert Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="title"
              id="title"
              placeholder="For example, Cake"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="col-span-full sm:col-span-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-300"
          >
            Description
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="col-span-full sm:col-span-4">
          <label
            htmlFor="rating"
            className="block text-sm font-medium leading-6 text-gray-300"
          >
            Rating
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="rating"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="col-span-full sm:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={async () => {
              await createDessert(
                {
                  title,
                  description,
                  rating,
                },
                user.token,
              );

              await getDessertsFromDB();

              setTitle("");
              setDescription("");
              setRating("");
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto mt-10">
        {desserts.length === 0 ? (
          <p className="text-2xl font-semibold text-gray-600">
            No desserts yet!!
          </p>
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {desserts.map((dessert) => {
                const isEditing = editingId === dessert._id;

                return (
                  <tr
                    key={dessert._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    {isEditing ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            className={INPUT_CLASS}
                            value={editedDessert.title}
                            onChange={(e) =>
                              setEditedDessert({
                                ...editedDessert,
                                title: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="px-6 py-4">
                          <input
                            className={INPUT_CLASS}
                            value={editedDessert.description}
                            onChange={(e) =>
                              setEditedDessert({
                                ...editedDessert,
                                description: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="px-6 py-4">
                          <input
                            className={INPUT_CLASS}
                            value={editedDessert.rating}
                            onChange={(e) =>
                              setEditedDessert({
                                ...editedDessert,
                                rating: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="px-6 py-4">
                          <button
                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white"
                            onClick={async () => {
                              await editDessert(
                                {
                                  ...editedDessert,
                                  _id: dessert._id,
                                },
                                user.token,
                              );

                              setEditingId(null);
                              getDessertsFromDB();
                            }}
                          >
                            Save
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {dessert.title}
                        </th>

                        <td className="px-6 py-4">{dessert.description}</td>

                        <td className="px-6 py-4">{dessert.rating}</td>

                        <td className="px-6 py-4 flex gap-2">
                          <button
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                            onClick={() => {
                              setEditingId(dessert._id);
                              setEditedDessert({
                                title: dessert.title,
                                description: dessert.description,
                                rating: dessert.rating,
                              });
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                            onClick={async () => {
                              await deleteDessert(dessert, user.token);
                              getDessertsFromDB();
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
