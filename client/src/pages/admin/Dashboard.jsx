import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import { PieChartt } from "./Chart";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isSuccess) {
    console.log(data);
  }

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>;

  //
  const { purchasedCourse } = data || [];

  // const courseData = purchasedCourse?.map((course) => ({
  //   name: course?.courseId?.courseTitle || "Unknown",
  //   price: course?.courseId?.coursePrice || 0,
  //   amount: course?.amount || 0,
  //   userId: course?.userId || "Unknown",
  // }));

  const totalRevenue =
    purchasedCourse?.reduce((acc, element) => acc + (element?.amount || 0), 0) || 0;
  const totalSales = purchasedCourse?.length || 0;
  const totalStudents = new Set(purchasedCourse?.map((course) => course?.userId)).size - 1 || 0;
  // const totalMaterials = new Set(purchasedCourse?.filter(course => course?.courseId?._id && course?.courseId?.isPublished)).map(course => course?.courseId?._id).size || 0;

  const filteredCourses = purchasedCourse?.filter(
    (course) => course?.courseId?._id && course?.courseId?.isPublished
  );
  console.log("Filtered Published Courses:", filteredCourses);

  const totalMaterials = new Set(filteredCourses?.map((course) => course?.courseId?._id)).size;

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Sales : </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Payment : </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">${totalRevenue}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Students : </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Created Materials : </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalMaterials}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <PieChartt className="" />
      </div>
    </>
  );
};

export default Dashboard;
