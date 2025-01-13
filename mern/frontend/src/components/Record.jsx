import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "./config"; // Import the configuration file

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);

      try {
        const response = await fetch(`${config.BASE_URL}/record/${id}`);
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const record = await response.json();
        if (!record) {
          console.warn(`Record with id ${id} not found`);
          navigate("/");
          return;
        }
        setForm(record);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [params.id, navigate]);

  // Update form state
  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch(`${config.BASE_URL}/record`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        response = await fetch(`${config.BASE_URL}/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred adding or updating a record:", error);
    } finally {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Employee Record</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly, so be careful what you share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="First Last"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Position
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="position"
                  id="position"
                  className="block w-full rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Developer Advocate"
                  value={form.position}
                  onChange={(e) => updateForm({ position: e.target.value })}
                />
              </div>
            </div>

            <div>
              <fieldset className="mt-4">
                <legend className="sr-only">Position Options</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {["Intern", "Junior", "Senior"].map((level) => (
                    <div key={level} className="flex items-center">
                      <input
                        id={`position${level}`}
                        name="positionOptions"
                        type="radio"
                        value={level}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={form.level === level}
                        onChange={(e) => updateForm({ level: e.target.value })}
                      />
                      <label
                        htmlFor={`position${level}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Save Employee Record
        </button>
      </form>
    </>
  );
}
