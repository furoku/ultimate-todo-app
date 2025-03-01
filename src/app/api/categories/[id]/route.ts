import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// 個別のカテゴリを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        todos: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// カテゴリを更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // 名前の重複チェック（同じIDのカテゴリは除外）
    if (body.name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: body.name,
          id: {
            not: params.id,
          },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "Category with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        color: body.color,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// カテゴリを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // このカテゴリを使用しているタスクを更新
    await prisma.todo.updateMany({
      where: {
        categoryId: params.id,
      },
      data: {
        categoryId: null,
      },
    });

    // カテゴリを削除
    await prisma.category.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}