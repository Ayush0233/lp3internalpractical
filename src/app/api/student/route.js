// src/app/api/student/route.js
import { NextResponse } from 'next/server';

// Simple in-memory store (ephemeral)
let STUDENTS = [];

// Basic CORS headers for demo
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

// GET -> return list of students
export function GET() {
  return NextResponse.json({ count: STUDENTS.length, students: STUDENTS }, { headers: CORS });
}

// POST -> accept student JSON and append (basic validation)
export async function POST(request) {
  try {
    const body = await request.json();

    // Basic validation
    const { roll, name, course, gender, email } = body || {};
    const errors = [];
    if (!roll) errors.push('roll is required');
    if (!name) errors.push('name is required');
    if (!course) errors.push('course is required');
    if (!gender) errors.push('gender is required');
    if (!email) errors.push('email is required');

    if (errors.length) {
      return NextResponse.json({ error: 'validation_failed', details: errors }, { status: 400, headers: CORS });
    }

    const student = {
      id: Date.now().toString(), // simple id
      roll,
      name,
      course,
      gender,
      email,
      receivedAt: new Date().toISOString(),
    };

    STUDENTS.push(student);

    return NextResponse.json({ message: 'Student received', student }, { status: 201, headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: 'invalid_json', details: String(err) }, { status: 400, headers: CORS });
  }
}
