import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// カテゴリ一覧を取得
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// 新しいカテゴリを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 名前が既に存在するか確認
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: body.name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        color: body.color || "#6366F1", // デフォルトカラー
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}