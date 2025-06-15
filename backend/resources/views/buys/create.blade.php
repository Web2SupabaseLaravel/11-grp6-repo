@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Add New Purchase</div>

                <div class="card-body">
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul class="mb-0">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('buys.store') }}">
                        @csrf

                        <div class="form-group row mb-3">
                            <label for="user_id" class="col-md-4 col-form-label text-md-right">User</label>

                            <div class="col-md-6">
                                <select id="user_id" class="form-control @error('user_id') is-invalid @enderror" name="user_id" required>
                                    <option value="">Select User</option>
                                    @foreach($users as $user)
                                        <option value="{{ $user->id }}" {{ old('user_id') == $user->id ? 'selected' : '' }}>
                                            {{ $user->name }}
                                        </option>
                                    @endforeach
                                </select>

                                @error('user_id')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label for="ticket_id" class="col-md-4 col-form-label text-md-right">Ticket</label>

                            <div class="col-md-6">
                                <select id="ticket_id" class="form-control @error('ticket_id') is-invalid @enderror" name="ticket_id" required>
                                    <option value="">Select Ticket</option>
                                    @foreach($tickets as $ticket)
                                        <option value="{{ $ticket->id }}" {{ old('ticket_id') == $ticket->id ? 'selected' : '' }}>
                                            {{ $ticket->title ?? $ticket->id }}
                                        </option>
                                    @endforeach
                                </select>

                                @error('ticket_id')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label for="purchase_date" class="col-md-4 col-form-label text-md-right">Purchase Date</label>

                            <div class="col-md-6">
                                <input id="purchase_date" type="date" class="form-control @error('purchase_date') is-invalid @enderror"
                                       name="purchase_date" value="{{ old('purchase_date') }}">

                                @error('purchase_date')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    Save
                                </button>
                                <a href="{{ route('buys.index') }}" class="btn btn-secondary">
                                    Cancel
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
