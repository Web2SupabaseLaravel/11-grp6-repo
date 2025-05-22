@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Purchase List</h5>
                    <a href="{{ route('buys.create') }}" class="btn btn-primary btn-sm">Add New</a>
                </div>

                <div class="card-body">
                    @if(session('success'))
                        <div class="alert alert-success">{{ session('success') }}</div>
                    @endif

                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Ticket ID</th>
                                    <th>Purchase Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($buys as $buy)
                                    <tr>
                                        <td>{{ $buy->user_id }}</td>
                                        <td>{{ $buy->ticket_id }}</td>
                                        <td>{{ $buy->purchase_date }}</td>
                                        <td>
                                            <div class="btn-group" role="group">
                                                <a href="{{ route('buys.edit', [$buy->user_id, $buy->ticket_id]) }}" class="btn btn-sm btn-warning">Edit</a>
                                                <form action="{{ route('buys.destroy', [$buy->user_id, $buy->ticket_id]) }}" method="POST" class="d-inline">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
